FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -la /app

RUN npm run build

CMD ["npm", "run", "start:dev"]

EXPOSE 3001


