FROM node:lts-alpine
ENV NODE_ENV production
ENV STAGE prod

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN yarn install

CMD yarn start
