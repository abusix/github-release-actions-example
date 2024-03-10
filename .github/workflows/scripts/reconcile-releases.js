/** The maximum number of release pages to search through to find prereleases to be cleaned up. */
const MAX_PAGE_SEARCH = 5;

module.exports = async ({ github, context }, targetReleaseId) => {
  const { owner, repo } = context.repo;

  const targetRelease = await github.rest.repos.getRelease({
    owner,
    repo,
    release_id: targetReleaseId,
  });

  if (targetRelease.data.draft) {
    console.log("Target is a draft release, finding prereleases to bundle up");

    // Collect all prereleases
    let prereleases = [];
    const releasesIterator = github.paginate.iterator(
      github.rest.repos.listReleases,
      {
        owner,
        repo,
      }
    );
    while (!result.done && currentPage <= MAX_PAGE_SEARCH) {
      prereleases = prereleases.concat(
        result.value.data.filter((release) => release.prerelease)
      );
      result = await releasesIterator.next();
    }

    // Determine which prereleases are older than the target release
    let newerPreleaseCount = 0;
    const olderPreleases = [];
    for (const prerelease of prereleases) {
      const diff = await github.rest.repos.compareCommitsWithBasehead({
        owner,
        repo,
        basehead: `${prerelease.tag_name}...${targetRelease.data.tag_name}`,
      });

      if (diff.data.ahead_by > 0) {
        console.log(
          `Prerelease ${prerelease.tag_name} is newer than target release, skipping`
        );
        newerPreleaseCount++;
        continue;
      } else {
        console.log(
          `Prerelease ${prerelease.tag_name} is older than target release, adding to cleanup list`
        );
        olderPreleases.push(prerelease);
      }
    }

    console.log(
      `Found ${olderPreleases.length} older prereleases to cleanup, ${newerPreleaseCount} newer prereleases skipped`
    );

    // Delete older prereleases
    for (const olderPrerelease of olderPreleases) {
      await github.rest.repos.deleteRelease({
        owner,
        repo,
        release_id: olderPrerelease.id,
      });
    }

    console.log("Promoting draft release to production");
    // Promote draft release to production
    await github.rest.repos.updateRelease({
      owner,
      repo,
      release_id: "${{ steps.validate_deployment.outputs.result }}",
      draft: false,
      prerelease: false,
      latest: true,
    });
  } else {
    console.log("Target is an existing release, marking release as latest");

    await github.rest.repos.updateRelease({
      owner,
      repo,
      release_id: "${{ steps.validate_deployment.outputs.result }}",
      make_latest: true,
    });
  }
};
