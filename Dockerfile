FROM oven/bun:0.6.2

RUN apt update && apt install nut -y

WORKDIR /app

COPY ./package.json .
COPY ./tsconfig.json .

RUN bun install

COPY ./src ./src

CMD ["bun", "start"]
