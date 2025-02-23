FROM node:23.8.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g serve

RUN npm run build  # Build the app using Vite (which outputs to the dist folder)

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
