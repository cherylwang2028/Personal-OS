#!/usr/bin/env bash
# Copy static assets into public/ for Render Static Site
set -e
mkdir -p public
cp *.html public/
cp -r css js public/
echo "Built public/ with:"
ls -la public/
