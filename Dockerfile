FROM oven/bun:1.1.2

RUN apt update && apt install nut -y

WORKDIR /app

COPY ./package.json .
COPY ./tsconfig.json .

RUN bun install

COPY ./src ./src

CMD ["bun", "start"]
