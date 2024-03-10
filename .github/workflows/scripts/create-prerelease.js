module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;

  await github.rest.git.createRef({
    owner,
    repo,
    ref: "refs/tags/${{ env.RELEASE_VERSION }}",
    sha: context.sha,
  });

  const newRelease = await github.rest.repos.createRelease({
    owner,
    repo,
    prerelease: true,
    tag_name: "${{ env.RELEASE_VERSION }}",
    name: "${{ env.RELEASE_VERSION }}",
    generate_release_notes: true,
  });

  console.log(`Created prerelease: ${newRelease.data.html_url}`);
};
