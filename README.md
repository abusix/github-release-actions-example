# Action Deployment POC

Proof-of-concept for a deployment/rollback flow using github actions and releases

## Requirements

- When a merge is done to the `main` branch, a pending release should be created / updated
  - A tag should be created and used for the release based on the current date and time
  - The release should be created with the tag and the release notes should be the commit messages since the last release
  - The release should be marked as a draft
  - Any artifacts required for the deployment should be uploaded to the release
- When the release action is manually triggered
  - The release should be marked as a non-draft
  - A deployment should be done to the `production` environment
- When the rollback action is manually triggered
  - The last release should be marked as a draft
  - A deployment should be done to the `production` environment using the selected release

## Implementation

- https://github.com/marketplace/actions/get-release is used to get the id of the last release
- https://github.com/softprops/action-gh-release is used to create the new release
- https://github.com/irongut/EditRelease is used to edit the release if it already exists
- `git log --pretty=oneline tagA...tagB` is used to get the commit messages since the last release

## Run Sample App Locally

```sh
docker build --build-arg APP_VERSION=local -t action-deployment-poc:local .
docker run -p 7890:80 action-deployment-poc:local
```

# Initial setup

- The latest state of the main branch should be deployed to production
- A date tag and release should be up to date with the latest state of the main branch
