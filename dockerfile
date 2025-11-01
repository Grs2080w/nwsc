FROM node:20-slim AS builder
WORKDIR /app

COPY . .
RUN npm i

RUN npm run build
CMD ["npm", "run", "start:server"]

# isn't otimized, i know
