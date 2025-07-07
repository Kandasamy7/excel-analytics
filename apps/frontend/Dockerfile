# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# 🟨 Build the frontend — this MUST use correct env vars at build time
RUN npm run build

# Install serve to serve static site
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Serve the build
CMD ["serve", "-s", "dist", "-l", "5173"]
