import type { FieldsJson } from "./types"
import Config from "./Config.svelte"
;(async (PLUGIN_ID) => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID)
  console.log(config)

  const res: FieldsJson = await kintone.api("/k/v1/app/form/fields.json", "GET", {
    app: kintone.app.getId(),
  })
  if (!res?.properties) return

  const app = new Config({
    target: document.querySelector("#config"),
    props: {
      properties: res.properties,
    },
  })

  // @ts-ignore
})(kintone.$PLUGIN_ID)
