FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
# Omit --production flag for TypeScript devDependencies
RUN yarn --frozen-lockfile

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG ETHERSCAN_API_KEY
ENV ETHERSCAN_API_KEY=${ETHERSCAN_API_KEY}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN yarn build

# Start Next.js based on the preferred package manager
CMD yarn start
