#!/bin/bash
set -e

echo "Starting OpenClaw Gateway..."

if [ -n "$R2_ACCESS_KEY_ID" ] && [ -n "$R2_SECRET_ACCESS_KEY" ] && [ -n "$CF_ACCOUNT_ID" ]; then
    echo "Mounting R2 bucket: $R2_BUCKET_NAME"
    mkdir -p /data /tmp/s3fs-cache
    
    export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
    export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
    
    fusermount -u /data 2>/dev/null || true
    s3fs "$R2_BUCKET_NAME" /data \
        -o url="https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com" \
        -o use_path_request_style \
        -o allow_other \
        -o uid=1000,gid=1000 \
        -o umask=0022 \
        -o nonempty \
        -o use_cache=/tmp/s3fs-cache \
        -o ensure_diskfree=5000 \
        -o parallel_count=8 \
        -o dbglevel=info \
        2>&1 || { echo "s3fs mount failed, continuing with local storage"; }
    echo "R2 mount complete"
else
    echo "R2 credentials not set, using local volume"
    mkdir -p /data
fi

echo "Setting up workspace..."
if ! mkdir -p /data/workspace/skills /data/workspace/.openclaw; then
    echo "Primary data path unavailable, falling back to local volume"
    fusermount -u /data 2>/dev/null || true
    mkdir -p /data
    mkdir -p /data/workspace/skills /data/workspace/.openclaw
fi

for file in SOUL.md USER.md AGENTS.md TOOLS.md; do
    if [ -f "/app/$file" ] && [ ! -f "/data/workspace/$file" ]; then
        cp "/app/$file" "/data/workspace/$file"
    fi
done

for file in IDENTITY HEARTBEAT BOOT BOOTSTRAP; do
    template="/app/$file.md.template"
    target="/data/workspace/$file.md"
    if [ -f "$template" ] && [ ! -f "$target" ]; then
        cp "$template" "$target"
    fi
done

echo "Copying skills to workspace..."
if ! rm -rf /data/workspace/skills/* 2>/dev/null; then
    echo "Failed to clear workspace skills directory; continuing"
fi

for name in my-farm-advisor my-farm-breeding-trial-management my-farm-qtl-analysis superior-byte-works-google-timesfm-forecasting superior-byte-works-wrighter; do
    dir=/app/skills/$name
    if [ -d "$dir" ] && [ -f "$dir/SKILL.md" ]; then
        cp -R "$dir" /data/workspace/skills/
    fi
done

if [ -d "/app/skills/k-dense/scientific-skills" ]; then
    for dir in /app/skills/k-dense/scientific-skills/*/; do
        name=$(basename "$dir")
        if [ "$name" != "offer-k-dense-web" ] && [ -f "$dir/SKILL.md" ]; then
            cp -R "$dir" /data/workspace/skills/
        fi
    done
fi

if [ -d "/app/skills/antigravity/skills" ]; then
    for dir in /app/skills/antigravity/skills/*/; do
        name=$(basename "$dir")
        if [ "$name" != "claude-scientific-tools" ] && [ -f "$dir/SKILL.md" ]; then
            cp -R "$dir" /data/workspace/skills/
        fi
    done
fi

echo "Starting gateway..."
exec node dist/index.js gateway --bind ${OPENCLAW_GATEWAY_BIND:-lan} --port 18789 --allow-unconfigured
