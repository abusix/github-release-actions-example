module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo;
  /*
   * We should only need to load 2 releases, as either both will be latest, or one will be latest and
   * the other will be pending. We're loading a few extras here so that if we get into a weird state
   * we can provide a better error.
   */
  const PAGE_SIZE = 10;
  const releases = await github.rest.repos.listReleases({
    owner,
    repo,
    per_page: PAGE_SIZE,
  });

  const pendingReleases = releases.data.filter((release) => release.prerelease);
  if (pendingReleases.length > 1) {
    throw new Error(
      `Found more than one pending release: ${pendingReleases
        .map((release) => release.tag_name)
        .join(", ")}`
    );
  }
  if (pendingReleases.length === 1) {
    console.log(
      `Found existing pending release: ${pendingReleases[0].tag_name}, replacing it`
    );
    await github.rest.repos.deleteRelease({
      owner,
      repo,
      release_id: pendingReleases[0].id,
    });
  }

  const newRelease = await github.rest.repos.createRelease({
    owner,
    repo,
    prerelease: true,
    tag_name: "${{ env.RELEASE_VERSION }}",
    name: "${{ env.RELEASE_VERSION }}",
    generate_release_notes: true,
  });
  console.log(`Created pending release: ${newRelease.data.html_url}`);
};
