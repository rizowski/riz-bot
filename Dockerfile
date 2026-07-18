FROM --platform=linux/amd64 node:26-alpine
ENV NODE_ENV production
ENV STAGE prod
ENV DOPPLER_TOKEN $DOPPLER_TOKEN

RUN apk upgrade \
  && apk add curl gpg ffmpeg yt-dlp

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Doppler install
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh

COPY --chown=node:node . /app
USER node

RUN yarn install --immutable
ENTRYPOINT ["doppler", "run", "--"]
CMD yarn start
