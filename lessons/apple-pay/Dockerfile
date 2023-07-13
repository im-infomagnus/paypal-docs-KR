FROM node:14-slim

ADD . /

ARG CLIENT_ID
ARG APP_SECRET

ENV CLIENT_ID=$CLIENT_ID
ENV APP_SECRET=$APP_SECRET

RUN npm ci && npm cache clean --force

CMD node server/index.js