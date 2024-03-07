# Use Alpine Linux as base image
FROM alpine:latest

# Set the working directory in the Docker image to /app
WORKDIR /app

# Install curl and Node.js
RUN apk update && \
    apk add --no-cache curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apk add --no-cache nodejs

# Copy package.json and package-lock.json into the image
COPY package*.json ./

# Install any project dependencies
RUN npm install

# Copy the rest of your project's source code into the image
COPY . .

# Define the command to run your app
CMD [ "node", "index.js" ]