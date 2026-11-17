#!/usr/bin/env bash
# Waits until the live GitHub Pages site serves this commit (build-id meta tag
# written by scripts/prerender.mjs) and every JS/CSS file it references.
set -uo pipefail
SITE="${SITE:-https://${GITHUB_REPOSITORY_OWNER}.github.io}"
SHA="${GITHUB_SHA:?GITHUB_SHA not set}"
TRIES="${TRIES:-20}"

for i in $(seq 1 "$TRIES"); do
  html=$(curl -fsSL -H 'Cache-Control: no-cache' "$SITE/?cb=${GITHUB_RUN_ID:-local}-$i" || true)
  if echo "$html" | grep -q "name=\"build-id\" content=\"$SHA\""; then
    ok=1
    for asset in $(echo "$html" | grep -oE '/assets/[^"]+\.(js|css)' | sort -u); do
      curl -fsS -o /dev/null "$SITE$asset" || { echo "asset not served yet: $asset"; ok=0; }
    done
    if [ "$ok" = 1 ]; then
      echo "live site is serving $SHA"
      exit 0
    fi
  else
    echo "attempt $i/$TRIES: live site is not on $SHA yet"
  fi
  sleep 15
done
echo "::warning::live site did not pick up $SHA"
exit 1
