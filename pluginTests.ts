// @ts-ignore
import * as GogoanimePlugin from "./plugins/gogoanime/GogoanimePlugin";
// @ts-ignore
import * as GogoanimePluginOld from "./plugins/gogoanime-old/GoganimePluginOld";

const plugins = [GogoanimePlugin, GogoanimePluginOld];

function testPlugin(plugin: any) {
  try {
    plugin.search("one", 1).then((res) => {
      if (res.name) {
        console.log(`✅ ${res.name} - ${res.description}`);
        if (res.items.length > 0) {
          console.log(`✅ ${res.items.length} items found.`);
          console.log(`Attempting to get details for first item...`);
          try {
            plugin.getItemDetails(res.items[0].id).then((item) => {
              console.log(`✅ ${item.name} - ${item.description}`);
              if (item.media.length > 0) {
                console.log(`✅ ${item.media.length} media found`);
                console.log("Attempting to get media for first item...");
                try {
                  plugin.getItemMedia(item.media[0].id).then((media) => {
                    console.log(`✅ ${media.length} media found`);
                  });
                } catch (error) {
                  console.log(
                    `❌ Media failed for ${res.items[0].id}: ${error}`
                  );
                }
              } else {
                console.log(`❌ No media found`);
              }
            });
          } catch (error) {
            console.log(
              `❌ Item details failed for ${res.items[0].id}: ${error}`
            );
          }
        } else {
          console.log(`❌ No items found`);
        }
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
