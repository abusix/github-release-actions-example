# Action Deployment POC

Proof-of-concept for a deployment/rollback flow using github actions and releases

## Requirements

- When a merge is done to the `main` branch, a pending release should be created / updated
  - A tag should be created and used for the release based on the current date and time
  - The release should be created with the tag and notes describing the changes since the last release
  - The release should be marked as a prerelease
  - Any artifacts required for the deployment should be uploaded to the release (none yet but could be in the future)
  - The release should be automatically deployed to the `staging` (`dev`) environment
- When the `publish-new-release` action is manually triggered
  - A deployment should be done to the `production` environment using the selected pre-release
  - The release should be set to `latest`
- When the `deploy-existing-release` is manually triggered
  - A deployment should be done to the `production` environment using the selected release
  - The current release should have it's `latest` status removed
  - The target selected release should be set to `latest`
  
## Limitations

- We're only providing the option to deploy ALL pending releases rather than pick and choose an older one like we have with the current behaviour

## Implementation

- ~~https://github.com/marketplace/actions/get-release is used to get the id of the last release~~
- ~~https://github.com/softprops/action-gh-release is used to create the new release~~
- ~~https://github.com/irongut/EditRelease is used to edit the release if it already exists~~
- Instead of using multiple poorly maintained actions I instead opted to make heavy use of `actions/github-script@v7`
- ~~`git log --pretty=oneline tagA...tagB` is used to get the commit messages since the last release~~
- It turned out github automatic release notes are actually better, but rely heavily on PRs (which should suit us).

## Run Sample App Locally

### From Github Registry

```sh
docker pull docker pull ghcr.io/danielemery/action-deployment-poc:latest
docker run -p 7890:80 ghcr.io/danielemery/action-deployment-poc:latest
```

### With Local Build

```sh
docker build --build-arg APP_VERSION=local -t action-deployment-poc:local .
docker run -p 7890:80 action-deployment-poc:local
```
