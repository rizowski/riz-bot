FROM node:10.14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN node -v
# Copy Files
COPY . .
COPY ./config ./config

RUN yarn install --prod

CMD yarn start
