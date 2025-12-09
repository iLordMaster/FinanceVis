FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm i -g pm2

COPY . .

EXPOSE 5001

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]