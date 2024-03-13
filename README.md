# github-release-actions Example

This repository serves only as an example and demonstration of how to use the `github-release-actions` to create and deploy releases.

See the [github-release-actions](https://github.com/abusix/github-release-actions) repository for documentation on the action itself.

## Sample App

In order to demonstrate the action, a simple web page is included with src that is deployed with Docker using a `nginx:alpine` base.

`latest` of this image is reflected on what would be deployed to the `production` environment in a real application. The `staging` tag reflects what would be deployed to the `staging` environment.

## Run Sample App Locally

### From Github Registry

```sh
docker pull docker pull ghcr.io/abusix/action-deployment-poc:latest
docker run -p 7890:80 ghcr.io/abusix/action-deployment-poc:latest
```

### With Local Build

```sh
docker build --build-arg APP_VERSION=local -t action-deployment-poc:local .
docker run -p 7890:80 action-deployment-poc:local
```
