# Use Ubuntu 22.04 as base image
FROM ubuntu:alpine

# Set the working directory in the Docker image to /app
WORKDIR /app

# Install curl and Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Copy package.json and package-lock.json into the image
COPY package*.json ./

# Install any project dependencies
RUN npm install

# Copy the rest of your project's source code into the image
COPY . .

# Define the command to run your app
CMD [ "node", "index.js" ]