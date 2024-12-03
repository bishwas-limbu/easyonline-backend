FROM node:alpine3.18

WORKDIR /app

COPY package*.json ./
COPY .env .env
COPY . .

RUN npm install

EXPOSE 9000

CMD ["npm","start"]