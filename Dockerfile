# Use Bun official lightweight image
FROM oven/bun:1.1-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy project files
COPY . .

# Expose Metro bundler and web ports
EXPOSE 8081 19000 19001 19002

# Start Expo in dev mode
CMD ["bun", "run", "start"]
