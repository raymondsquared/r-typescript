FROM node:10-slim

WORKDIR /r-api

COPY . /r-api

RUN npm ci
RUN npm run build

CMD [ "npm", "run", "serve" ]
