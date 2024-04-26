# ⚡ NutPowerGrid/Collector
#### 📢 Development is still in progress. Expect some bugs.

Easily export data from your ups to

- InfluxDB
- JSON (file)
- CSV (file)

Easily send notification on power loss to

- Discord
- Gotify

Easily access the data from your ups with a

- JSON Api

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

## Creating Plugins
Enhance the functionality by implementing custom plugins.
Feel free to utilize the provided plugins as a reference to create your own custom plugins.

Follow these steps to create and integrate a plugin:

### 1. Create a New File
Begin by creating a new file in the plugin folder of your application. Name it appropriately, reflecting the purpose of your plugin.

### 2. Define the Plugin Class
Define a class that extends the Plugin class. This class serves as the foundation for your plugin's functionality. Ensure that it includes the necessary methods and properties.

### 3. Implement Required Functions
#### Constructor
Create a constructor function within your class to initialize the plugin. The constructor will receive environment variables as its only parameter. Utilize this function to set up essential configurations and resources needed by your plugin.

#### Send Function
Implement a send function to handle data transmission from the UPS.

#### Close Function
Define a close function to gracefully shut down the plugin when necessary. (Release any resources or connections established by the plugin during its operation.)

### Plugin Properties
#### _prefix
The _prefix property serves as a unique identifier for the plugin within the application. It helps distinguish the plugin's functionality and configuration from others when managing multiple plugins.

#### _model
The _model property defines the environment variables required by the plugin to function correctly. These variables will be automatically injected into the constructor.

