# Complete VPS Hosting Guide (Docker & Docker Compose)

This guide shows you how to host **Amar Dokan** on any Virtual Private Server (VPS) such as DigitalOcean, Hetzner, Linode, AWS EC2, or Vultr.

---

## 1. Initial VPS Setup

Connect to your VPS via SSH:
```bash
ssh root@your_server_ip
```

Update packages and install Docker:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker via official convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify Docker installation
docker --version
docker compose version
```

---

## 2. Clone Repository to the VPS

```bash
cd /opt
git clone <YOUR_GIT_REPOSITORY_URL> ecommerce
cd ecommerce
```

---

## 3. Configure Environment Variables

Copy the template:
```bash
cp .env.example .env
nano .env
```

Set the values:
```bash
APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STORE_NAME="Amar Dokan"

# Generate 32+ character secrets:
# openssl rand -base64 32
AUTH_SECRET="your-generated-auth-secret-min-32-chars"
CRON_SECRET="your-generated-cron-secret-min-16-chars"

# Database credentials (matches docker-compose.yml)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_db_password
POSTGRES_DB=ecommerce

# Telegram Bot
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"

# Payment (SSLCommerz)
SSLCOMMERZ_STORE_ID="your_store_id"
SSLCOMMERZ_STORE_PASSWORD="your_store_password"
SSLCOMMERZ_SANDBOX=false
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## 4. Launch Application with One Command

Run the deployment script:
```bash
chmod +x deploy.sh docker-entrypoint.sh
./deploy.sh
```

Or run Docker Compose directly:
```bash
docker compose up -d --build
```

Check running containers:
```bash
docker compose ps
```
You will see `ecommerce_web` and `ecommerce_postgres` running healthy.

---

## 5. Seed Database & Create Admin Account

To seed demo products and categories:
```bash
docker compose exec web npx tsx prisma/seed.ts
```

To create your personalized admin user interactively:
```bash
docker compose exec -it web npx tsx scripts/create-admin.ts
```

---

## 6. Point Domain & Setup Free SSL (Nginx & Certbot)

Install Nginx and Certbot:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/ecommerce
```

Paste the following:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # File upload size limit for image bytea upload (max 10M)
        client_max_body_size 10M;
    }
}
```

Enable site and obtain free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Free Let's Encrypt SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 7. Setup 1-Minute Cron Job for Telegram Notifications

Add a cron job to trigger the notification outbox every minute:
```bash
crontab -e
```

Add the following line:
```cron
* * * * * curl -s -X POST https://yourdomain.com/api/cron/notifications -H "Authorization: Bearer YOUR_CRON_SECRET" > /dev/null 2>&1
```

---

## 8. Updating / Re-deploying Future Changes

Whenever you push new changes to Git, update your VPS with:
```bash
cd /opt/ecommerce
git pull origin main
docker compose build --pull web
docker compose up -d web
```
Zero downtime, schema auto-migrates on startup.
