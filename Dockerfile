# Optional local/Glama image. Prefer Glama admin form:
#   Build steps: ["npm install"]
#   CMD arguments: ["node", "./server.mjs"]
# Production clients should connect to https://dayze.com/api/mcp directly.
FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.mjs ./
CMD ["node", "./server.mjs"]
