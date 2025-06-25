# Umbrella Plugins Repository

This repository hosts plugins for the [Umbrella](https://github.com/new-umbrella/umbrella) mobile application - an open-source platform for streaming media content.

## Available Plugins

### Example Plugin

- **Author**: invader
- **Description**: Example plugin demonstrating Umbrella plugin capabilities
- **Version**: 1
- [Installation Link](umbrella://{}/plugins/example/ExamplePluginManifest.json)

### Gogoanime Plugin

- **Author**: invader
- **Description**: Access Gogoanime content through Umbrella
- **Version**: 1
- [Installation Link](umbrella://{}/plugins/gogoanime/GogoanimePluginManifest.json)

### Gogoanime Plugin (Old)

- **Author**: invader
- **Description**: Legacy version of Gogoanime plugin (no longer maintained)
- **Version**: 1
- [Installation Link](umbrella://{}/plugins/gogoanime-old/GogoanimePluginOldManifest.json)

## Installation

Plugins can be installed in two ways:

1. **Direct Installation**:

   - Open this repository's [release page](index.html) on a mobile device
   - Click the "Install Plugin" button for the desired plugin
   - Confirm installation in the Umbrella app

2. **Manual Installation**:
   - Open the Umbrella app
   - Go to Settings → Plugins
   - Paste the plugin manifest URL:
     - Example: `http://your-domain.com/plugins/example/ExamplePluginManifest.json`
     - Gogoanime: `http://your-domain.com/plugins/gogoanime/GogoanimePluginManifest.json`
     - Gogoanime (Old): `http://your-domain.com/plugins/gogoanime-old/GogoanimePluginOldManifest.json`

## Development

To create your own plugins, refer to the [Umbrella Plugin Documentation](https://github.com/new-umbrella/umbrella).

### Project Structure

```
├── models/          # Shared TypeScript models
├── plugins/         # Plugin implementations
│   ├── example/     # Example plugin
│   ├── gogoanime/   # Gogoanime plugin
│   └── gogoanime-old/ # Legacy Gogoanime plugin
├── index.html       # Plugin release page
└── README.md        # This file
```

## License

All plugins in this repository are licensed under the MIT License.
