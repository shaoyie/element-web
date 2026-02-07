#!/usr/bin/env bash

set -ex

BRANCH=$(git rev-parse --abbrev-ref HEAD)
DIST_VERSION=$(git describe --abbrev=0 --tags 2>/dev/null || true)

DIR=$(dirname "$0")

# If the branch comes out as HEAD then we're probably checked out to a tag, so if the thing is *not*
# coming out as HEAD then we're on a branch. When we're on a branch, we want to resolve ourselves to
# a few SHAs rather than a version.
if [[ $BRANCH != HEAD && ! $BRANCH =~ heads/v.+ ]]
then
    DIST_VERSION=$("$DIR"/get-version-from-git.sh)
fi

if [ -z "$DIST_VERSION" ]; then
    DIST_VERSION=$BRANCH
fi

DIST_VERSION=$("$DIR"/normalize-version.sh "$DIST_VERSION")
VERSION=$DIST_VERSION yarn build
echo "$DIST_VERSION" > /src/webapp/version
