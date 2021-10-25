import type { KintoneEventObject } from "./types"
import { getPluginConfig } from "./modules/getPluginConfig"
import { toHtml } from "./modules/toHtml"
import Display from "./components/Display.svelte"
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
          const parentEl = el?.parentElement
          if (parentEl) {
            parentEl.setAttribute("class", parentEl.getAttribute("class") + " yomiyasuin")
            // const appEl = document.createElement("div")
            new Display({
              target: parentEl,
              props: {
                html,
                containerEl: parentEl,
                valueSelector: ".control-value-gaia",
              },
            })
            console.log()
            // appEl.setAttribute("class", "yomiyasuin-wrapper markdown-body")
            // appEl.innerHTML = html
            // parentEl.appendChild(appEl)
          }
        })
      )
      return eventObject
    }
  )

  // @ts-ignore
})(kintone.$PLUGIN_ID)
