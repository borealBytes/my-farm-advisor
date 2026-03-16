#!/bin/sh
set -eu

if [ -z "${CLOUDFLARE_TUNNEL_TOKEN:-}" ]; then
  exit 0
fi

exec cloudflared tunnel \
  --no-autoupdate \
  run \
  --token "${CLOUDFLARE_TUNNEL_TOKEN}"
