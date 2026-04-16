FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copying both package.json AND package-lock.json
COPY package*.json ./


RUN npm install

# Bundle app source
COPY . .

# Match your .env PORT
EXPOSE 5007

CMD ["node", "server.js"]