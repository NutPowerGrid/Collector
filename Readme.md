# ⚡ NutPowerGrid/Collector
#### 📢 Development is still in progress. Expect some bugs.

Easily export data from your ups to

- InfluxDB
- JSON (file)
- CSV (file)

Easily send notification on power loss to

- Discord
- Gotify

## 🔧 Requirement

- Docker/Podman
- Nut server

## 📝 To Do :

- Export to
  - API (JSON)
  - SQL DB

## 📦 Installation :

### Docker

```bash
docker run -d -it \
  --name=nut_collector \ # name of your container
  -e NUT_IP=127.0.0.1 \ # IP of your nut server
  -e NUT_UPS_NAME=upsName \ # name of your ups
  -e DISCORD_URL=https://discord.com/api/webhooks/... \ # discord webhook url (see all availables options in .env)
  -v nut_Log:/app/log \ # volume for logs (optional)
  --restart unless-stopped \
  ghcr.io/nutpowergrid/collector:latest
```

## 🌄 Screenshot :

#### InfluxDB + Chronograf
<img width="1385" alt="image" src="https://github.com/NutPowerGrid/Collector/assets/56845767/aee5ba44-55a8-42b4-9b65-4ad4b2bfef59">

#### On startup
```bash
$ bun run src/index.ts
warn: Missing required environment variable: PATH -> JSON
warn: Missing required environment variable: PATH -> CSV
info: Power monitor enable
info: Loaded plugins (3):
 • DiscordHook
 • Gotify
 • Influx
```
