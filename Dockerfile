FROM node:lts-alpine3.15

RUN apk add nut --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/

WORKDIR /app

COPY ./src ./src
COPY ./package.json .
COPY ./package-lock.json .
COPY .env.local .env

RUN npm i

CMD ["npm", "start"]
