// @ts-ignore
import * as GogoanimePlugin from "./plugins/gogoanime/GogoanimePlugin";
// @ts-ignore
import * as GogoanimePluginOld from "./plugins/gogoanime-old/GoganimePluginOld";

const plugins = [GogoanimePlugin]; //, GogoanimePluginOld];

function testPlugin(plugin: any) {
  try {
    plugin.search("naruto", 1).then((res) => {
      if (res.name) {
        console.log(`✅ ${res.name} - ${res.description}`);
      } else {
        console.log(`❌ Search failed for ${plugin.constructor.name}`);
      }
    });
  } catch (error) {
    console.log(`❌ Search failed for ${plugin.constructor.name}: ${error}`);
  }
}

plugins.forEach((plugin) => {
  testPlugin(plugin);
});
