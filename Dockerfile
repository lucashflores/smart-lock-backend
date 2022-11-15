FROM node:16 AS builder

WORKDIR "/smart-lock-backend"

COPY . ./

RUN yarn

RUN yarn build

RUN yarn --production

FROM node:16 AS production

WORKDIR "/smart-lock-backend"

COPY --from=builder /smart-lock-backend/package.json ./package.json
COPY --from=builder /smart-lock-backend/dist ./dist
COPY --from=builder /smart-lock-backend/node_modules ./node_modules

CMD ["sh", "-c", "yarn start:prod"]
