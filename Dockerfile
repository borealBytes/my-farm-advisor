FROM docker.io/cloudflare/sandbox:0.7.0

# Install Node.js 22 (required by OpenClaw) and rclone (for R2 persistence)
# The base image has Node 20, we need to replace it with Node 22
# Using direct binary download for reliability
ENV NODE_VERSION=22.13.1
RUN ARCH="$(dpkg --print-architecture)" \
    && case "${ARCH}" in \
         amd64) NODE_ARCH="x64" ;; \
         arm64) NODE_ARCH="arm64" ;; \
         *) echo "Unsupported architecture: ${ARCH}" >&2; exit 1 ;; \
       esac \
    && apt-get update && apt-get install -y xz-utils ca-certificates rclone \
    && curl -fsSLk https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.xz -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && rm /tmp/node.tar.xz \
    && node --version \
    && npm --version

# Install pnpm globally
RUN npm install -g pnpm

# Install OpenClaw (formerly clawdbot/moltbot)
# Pin to specific version for reproducible builds
RUN npm install -g openclaw@2026.3.8 \
    && openclaw --version

# Create OpenClaw directories
# Legacy .clawdbot paths are kept for R2 backup migration
RUN mkdir -p /root/.openclaw/workspace \
    && mkdir -p /root/clawd \
    && mkdir -p /root/clawd/skills

ARG BUILD_CACHE_BUST=2026-03-11-v5-fix-paths
RUN test -n "$BUILD_CACHE_BUST"

# Copy startup script
# Build cache bust: 2026-03-11-v5-fix-paths
COPY ["start-openclaw.sh", "/usr/local/bin/start-openclaw.sh"]
RUN chmod +x /usr/local/bin/start-openclaw.sh && sha256sum /usr/local/bin/start-openclaw.sh

# Copy SOUL.md, AGENTS.md, and USER.md to OpenClaw workspace directory
COPY SOUL.md /root/.openclaw/workspace/SOUL.md
COPY AGENTS.md /root/.openclaw/workspace/AGENTS.md
COPY USER.md /root/.openclaw/workspace/USER.md

# Copy custom skills to OpenClaw's skills directory
# OpenClaw looks for skills in /usr/local/lib/node_modules/openclaw/skills/
COPY skills/ /tmp/skills-nested/
RUN find /tmp/skills-nested -name "SKILL.md" -type f | while read skillfile; do \
        skilldir=$(dirname "$skillfile"); \
        skillname=$(basename "$skilldir"); \
        target="/usr/local/lib/node_modules/openclaw/skills/$skillname"; \
        if [ ! -d "$target" ]; then \
            cp -r "$skilldir" "$target"; \
            echo "Copied skill: $skillname"; \
        fi; \
    done && \
    rm -rf /tmp/skills-nested

# Set working directory
WORKDIR /root/clawd

# Expose the gateway port
EXPOSE 18789
