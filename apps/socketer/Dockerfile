FROM node:18-alpine as base

WORKDIR /app

# dev image contains everything needed for testing, development and building
FROM base AS builder

RUN apk add --update git && rm -rf /var/cache/apk/*

ENV NODE_ENV build

# try to cache if somethings does't changes
# COPY resources ./resources
COPY node_modules ./node_modules
COPY package.json nx.json tsconfig.base.json package-lock.json./
# COPY proto ./proto
COPY libs ./libs
COPY apps ./apps

# yarn install must be run with the same os architecture as runtime enviroment.
# Some low level package binary may fail. Ex: sharp
RUN yarn install 
RUN npm run build --prod socketer && npm prune --production

# RUN npm install

# RUN npm run build socketer \
# 	&& npm prune --production

FROM base as release

RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

ENV NODE_ENV production

COPY --from=builder /app/package*.json /app/
# COPY --from=builder /app/yarn.lock /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/
# COPY --from=builder /app/resources/ /app/resources/
# COPY --from=builder /app/proto/ /app/proto/
COPY config ./config

CMD ["node", "./dist/apps/socketer/main.js"]
