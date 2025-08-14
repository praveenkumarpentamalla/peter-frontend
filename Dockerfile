FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./


RUN npm install --legacy-peer-deps

COPY . .


RUN npm install date-fns


RUN npm run build

RUN npm install pm2 -g

EXPOSE 3000

CMD ["npm", "start"]
