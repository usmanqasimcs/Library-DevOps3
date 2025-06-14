
# Server Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server source files
COPY . ./

# Expose the port your server is running on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
