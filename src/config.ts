import { getPluginConfig } from "./modules/getPluginConfig"
import type { FieldsJson, PluginConfig } from "./types"
import Config from "./Config.svelte"
;(async (PLUGIN_ID) => {
  const config: PluginConfig = getPluginConfig(PLUGIN_ID)

  const res: FieldsJson = await kintone.api("/k/v1/app/form/fields.json", "GET", {
    app: kintone.app.getId(),
  })
  if (!res?.properties) return

  new Config({
    target: document.querySelector("#config"),
    props: {
      properties: res.properties,
      config,
    },
  })

  // @ts-ignore
})(kintone.$PLUGIN_ID)
