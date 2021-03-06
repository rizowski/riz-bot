FROM node:10.14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN node -v
# Copy Files
COPY ./config ./config
COPY package.json yarn.lock .yarnclean README.md ./
COPY ./build .

RUN yarn install --prod

CMD yarn start
