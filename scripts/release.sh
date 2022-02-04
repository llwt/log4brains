#!/bin/bash
set -euo pipefail

readonly SELF_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ROOT_PATH="$(cd "${SELF_PATH}/.." && pwd)"

if [[ ! -f "${SELF_PATH}/release-credentials.local.sh" ]]; then
  echo "Please create the release-credentials.local.sh file with the following exports:"
  echo "NODE_AUTH_TOKEN, GH_TOKEN"
  exit 1
fi
source "${SELF_PATH}/release-credentials.local.sh"

cd "${ROOT_PATH}"

# TODO: change when going stable
yarn lerna publish \
  --conventional-commits \
  --conventional-prerelease \
  --force-publish \
  --create-release github
