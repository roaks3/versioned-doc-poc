#!/bin/bash

# NOTE: This script currently only works on OSX due to the `sed` command

SCRIPTS_DIR=$(dirname ${BASH_SOURCE[0]})
DATA_DIR=$SCRIPTS_DIR/../data

VERSION=$1

if [ -z $VERSION ]; then
  echo "ERROR: The release command requires a VERSION argument."
  exit
fi

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

if [ $CURRENT_BRANCH != "master" ]; then
  echo "ERROR: The release command can only be run from the 'master' branch. Please checkout the 'master' branch and try again."
  exit
fi

STAGED_CHANGES=`git diff --cached`
if [ -n "$STAGED_CHANGES" ]; then
  echo "ERROR: The release command cannot be run while there are staged changes in git. Please stash your changes and try again."
  exit
fi

COMMIT_SHA=`git rev-list -n 1 $VERSION`

if [ $? -ne 0 ]; then
  echo "ERROR: A \"$VERSION\" tag does not exist. Please create this tag, or provide a different VERSION argument that does have a tag."
  exit
fi

# Create a new branch for the release changes
WORKING_BRANCH="docs-release-$VERSION"
git checkout -b $WORKING_BRANCH

# Add the following entry to the front of the "versions" array in version-manifest.json:
#     {
#       "slug": "$VERSION",
#       "display": "$VERSION",
#       "ref": "$VERSION",
#       "commit-sha": "$COMMIT_SHA"
#     },
lf=$'\n'
sed -i '' "s/\"versions\": \[/\"versions\": \[\\$lf    {\\$lf      \"slug\": \"$VERSION\",\\$lf      \"display\": \"$VERSION\",\\$lf      \"ref\": \"$VERSION\",\\$lf      \"commit-sha\": \"$COMMIT_SHA\"\\$lf    },/" $DATA_DIR/version-manifest.json

# Commit changes and push up to GitHub
git add $DATA_DIR/version-manifest.json
git commit -m "Release docs for $VERSION"
git push origin $WORKING_BRANCH

# Cleanup
git checkout master
echo "Run 'git branch -D $WORKING_BRANCH' to clean up the working branch used for this release."
