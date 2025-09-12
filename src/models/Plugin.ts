// import ContentService from './ContentService';
import { SourceType } from './source/SourceType';

// Plugin
// This is the interface for a plugin
// It is used to register the plugin with the app
export interface Plugin {
  sourceType: SourceType;
  author?: string;
  name: string; // Unique identifier for the plugin
  version: number; // Plugin version
  description?: string; // Optional plugin description
  // initialize: () => void; // Called to register the plugin with the app
  // dispose?: () => void; // Cleanup logic for removing the plugin
  homePageUrl?: string; // Optional URL to the home page for the plugin
  iconUrl?: string; // Optional URL to an icon for the plugin
  manifestPath?: string; // Optional path to the manifest file
  manifestUrl?: string; // Optional URL to the manifest file
  pluginPath?: string; // Optional path to the plugin file
  pluginUrl: string; // Optional URL to the plugin file
  bannerImageUrl?: string; // Optional banner to show in plugin page
  changelog?: string;
  readme?: string;
  licese?: string;
  // contentServiceSource?: string; // Content service provided by the plugin to get content
  // contentService?: ContentService;
}
