
# ResumeGenius AI - Health Check

A professional resume analyzer that uses Gemini 3 Pro to provide realistic feedback, impact scores, and structured improvements.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run locally:
   ```bash
   export API_KEY="your_key"
   npm run dev
   ```

## Ubuntu Deployment (/var/www/resume-genius)

### 1. Prerequisites
- Node.js 20+
- PM2 (`npm install -g pm2`)
- Nginx

### 2. Setup
```bash
sudo mkdir -p /var/www/resume-genius
sudo chown -R $USER:$USER /var/www/resume-genius
cd /var/www/resume-genius
git clone <your-repo-url> .
npm install
```

### 3. Build & Run
```bash
# Build frontend
npx vite build

# Start secure backend proxy with PM2
export API_KEY="your_actual_gemini_key"
pm2 start server.js --name "resume-genius"
pm2 save
```

### 4. Nginx Configuration
Add this to your server block to avoid conflicts with your root Python app:
```nginx
location /resume-genius {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```
