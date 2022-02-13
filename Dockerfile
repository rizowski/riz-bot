FROM node:lts-alpine
ENV NODE_ENV production
ENV STAGE prod
ENV DOPPLER_TOKEN $DOPPLER_TOKEN

RUN apk upgrade \
  && apk add curl gpg

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Doppler install
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh

COPY --chown=node:node . /app
USER node

RUN yarn install
ENTRYPOINT ["doppler", "run", "--"]
CMD yarn start
