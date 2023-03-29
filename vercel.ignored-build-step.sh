#!/bin/bash

# Go to Settings > Git in your project and enter a command in the Ignored Build Step section.
# `bash ../../vercel.ignored-build-step.sh || npx turbo-ignore`

# https://vercel.com/guides/how-do-i-use-the-ignored-build-step-field-on-vercel
if [[ "$VERCEL_GIT_COMMIT_REF" != "main" && "$VERCEL_GIT_COMMIT_REF" != "dev" ]];
then
  echo "🛑 - This branch($VERCEL_GIT_COMMIT_REF) ignored build"
  exit 0;
fi

echo "✅ - Build can proceed"
exit 1;
