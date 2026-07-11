FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Barcha dependency larni o'rnatish
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]
