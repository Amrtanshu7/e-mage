FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency definitions first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose backend port
EXPOSE 8080

# Start the backend
CMD ["npm", "start"]
