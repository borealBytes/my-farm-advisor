#!/bin/sh
set -eu

if [ -z "${CLOUDFLARE_TUNNEL_TOKEN:-}" ]; then
  exit 0
fi

if [ -z "${OPENCLAW_PUBLIC_HOSTNAME:-}" ]; then
  echo "OPENCLAW_PUBLIC_HOSTNAME is required when CLOUDFLARE_TUNNEL_TOKEN is set" >&2
  exit 1
fi

cat >/tmp/cloudflared-config.yml <<EOF
ingress:
  - service: ${CLOUDFLARED_ORIGIN_URL:-http://openclaw-gateway:18789}
  - service: http_status:404
EOF

exec cloudflared tunnel \
  --config /tmp/cloudflared-config.yml \
  --no-autoupdate \
  run \
  --token "${CLOUDFLARE_TUNNEL_TOKEN}"
