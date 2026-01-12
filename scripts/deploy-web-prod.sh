#!/usr/bin/env bash
set -euo pipefail

cd ../

echo "🚀 Starting Expo web production export..."

npm run export:web:prod

echo "📦 Expo export complete. Syncing to S3..."

aws s3 sync dist/ s3://waitque-static-app --delete

echo "✅ Deployment complete!"
