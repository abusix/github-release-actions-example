/** The maximum number of release pages to search through to find the target release. */
const MAX_PAGE_SEARCH = 5;

/** Find the release with the given tag name. */
async function findRelease({ github, context }, targetTagName) {
  const { owner, repo } = context.repo;

  const releasesIterator = github.paginate.iterator(
    github.rest.repos.listReleases,
    {
      owner,
      repo,
    }
  );
  let currentPage = 1;
  for await (const value of releasesIterator) {
    console.log(`Searching through release page ${currentPage}`)
    console.log(value.data);
    const matchingRelease = value.data.find(
      (release) => release.tag_name === targetTagName
    );
    if (matchingRelease) {
      return matchingRelease;
    }
    currentPage++;
    if (currentPage > MAX_PAGE_SEARCH) {
      console.log(`Reached maximum page search, aborting`);
      break;
    }
  }
  return null;
}

module.exports = async ({ github, context }, targetReleaseTag) => {
  const { owner, repo } = context.repo;

  const targetRelease = await findRelease(
    { github, context },
    targetReleaseTag
  );
  if (!targetRelease) {
    throw new Error(`No release found for tag: ${targetReleaseTag}`);
  }
  if (targetRelease.draft) {
    throw new Error(
      "Found unexpected draft release, aborting deployment due to possible race conditions"
    );
  }

  if (targetRelease.prerelease) {
    console.log(
      `Target is a prerelease, creating draft release for approval: ${targetRelease.html_url}`
    );

    const draftRelease = await github.rest.repos.createRelease({
      owner,
      repo,
      tag_name: targetTagName,
      name: targetTagName,
      draft: true,
      prerelease: false,
      generate_release_notes: true,
    });

    return {
      releaseId: draftRelease.id,
      isExistingRelease: false,
    };
  }

  console.log(
    `Target is an existing release, proceeding with rollback/roll forward: ${targetRelease.html_url}`
  );
  return {
    releaseId: targetRelease.id,
    isExistingRelease: true,
  };
};
