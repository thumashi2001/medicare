# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine
# Copy the build output from Stage 1 to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a custom nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]