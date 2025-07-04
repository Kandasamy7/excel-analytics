# Frontend Dockerfile

# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the frontend code
COPY . .

# Build frontend
RUN npm run build

# Install serve to run static site
RUN npm install -g serve

# Expose frontend port
EXPOSE 5173

# Serve the build
CMD ["serve", "-s", "dist", "-l", "5173"]

