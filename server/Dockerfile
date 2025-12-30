# 1. Use Node 20 (Required by Mongoose v9+)
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of the server code
COPY . .

# 6. Expose the port (Cloud Run sets PORT env var automatically)
EXPOSE 8080

# 7. Define the command to run your app
# IMPORTANT: Ensure your main file is actually named "index.js".
# If your main file is "server.js", change "index.js" to "server.js" below.
CMD ["node", "index.js"]