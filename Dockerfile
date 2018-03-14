FROM node:8.10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN node -v
# Copy Files
COPY . .

RUN yarn install --prod

CMD yarn start | yarn bunyan
