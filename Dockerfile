FROM node:25-alpine3.22

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "start"]