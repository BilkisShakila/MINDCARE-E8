FROM node:18

# ⬇️ INI KRUSIAL
WORKDIR /app

# copy package.json
COPY package*.json ./
RUN npm install

# copy source code (app.js, dll)
COPY . .

EXPOSE 4000

CMD ["npm", "start"]