# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of the server code
COPY . .

# 6. Expose the port the app runs on (Google uses 8080 by default, but respects env)
EXPOSE 8080

# 7. Define the command to run your app
CMD ["node", "index.js"] 
# Note: If your main file is server.js, change "index.js" to "server.js"