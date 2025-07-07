# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "server"]

# # to build
# docker build -t excel-backend .

# #to run
# docker run -p 5000:5000 --env-file .env excel-backend
