#!/bin/bash
set -e

# Database backup
bash ./scripts/db-backup.sh

# Asset optimization
node ./scripts/optimize-assets.js

# Changelog generation
node ./scripts/generate-changelog.js

echo "All automation tasks complete!" 