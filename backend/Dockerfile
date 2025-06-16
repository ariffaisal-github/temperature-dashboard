# Use official Node.js LTS image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the full source
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose internal app port
EXPOSE 3000

# Start the app
CMD ["node", "cluster.js"]
