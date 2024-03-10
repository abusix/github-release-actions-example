module.exports = async ({ github, context }, tag) => {
  const { owner, repo } = context.repo;

  await github.rest.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${tag}`,
    sha: context.sha,
  });

  const newRelease = await github.rest.repos.createRelease({
    owner,
    repo,
    prerelease: true,
    tag_name: tag,
    name: tag,
    generate_release_notes: true,
  });

  console.log(`Created prerelease: ${newRelease.data.html_url}`);
};
