FROM node:20-alpine AS builder

WORKDIR /app

# Copy both package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies (including peer dependencies issues)
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# OPTIONAL: Ensure missing dependencies like `date-fns` are added
RUN npm install date-fns

# Build the app
RUN npm run build

# Install PM2 globally
RUN npm install pm2 -g

EXPOSE 3003

CMD ["npm", "start"]
