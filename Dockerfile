FROM alpine

RUN apk add nodejs npm
RUN apk add nut --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/

WORKDIR /app

COPY dist dist
copy package.json .
COPY package-lock.json .
RUN npm i

CMD ["node", "./dist/index.js"]
