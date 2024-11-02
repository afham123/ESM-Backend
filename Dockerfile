# Stage 1: Build the application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Run the build script to compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist /app/dist

# Install only production dependencies
RUN npm install --only=production

# Expose the port the server will run on
EXPOSE 3001

# Define the command to start the server
CMD ["npm", "start"]
