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

