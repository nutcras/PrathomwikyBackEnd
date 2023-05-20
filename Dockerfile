# Stage 1: Build stage
FROM node:16-bullseye-slim AS build
WORKDIR /app
ADD . /app
ENV NODE_ENV production

# Install build tools and Python dependencies
RUN apt-get update && apt-get install -y build-essential python3-dev && \
  rm -rf /var/lib/apt/lists/*


RUN npm ci

# Stage 2: Production stage
FROM gcr.io/distroless/nodejs:16
WORKDIR /app
COPY --from=build /app /app
CMD ["index.js"]

