
# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Debug: List files to see what we have
RUN ls -la

# Debug: Check if schema.prisma exists
RUN cat schema.prisma | head -10

# Generate Prisma client (schema.prisma is in root directory)
RUN npx prisma generate --schema=./schema.prisma

# Debug: Check if client was generated
RUN ls -la node_modules/.prisma/client/

# Copy rest of source code
COPY . .

# Expose port
EXPOSE 8080

# Start in development mode
CMD ["npm", "run", "dev"]


