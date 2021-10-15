import type { KintoneEventObject } from "./types"
import { getPluginConfig } from "./modules/getPluginConfig"
import { toHtml } from "./modules/toHtml"
;((PLUGIN_ID) => {
  kintone.events.on(
    ["app.record.detail.show", "app.record.create.show", "app.record.edit.show"],
    async (eventObject: KintoneEventObject) => {
      const config = getPluginConfig(PLUGIN_ID)
      const { record } = eventObject
      console.log(config)
      console.log(PLUGIN_ID)

      await Promise.all(
        config.targetFields.map(async (fieldCode) => {
          const html = await toHtml(record[fieldCode].value as string)

          const el = kintone.app.record.getFieldElement(fieldCode)
          if (el) {
            el.innerHTML = html
          }
        })
      )
      return eventObject
    }
  )

  // @ts-ignore
})(kintone.$PLUGIN_ID)
