import type { KintoneEventObject } from "./types"
import { getPluginConfig } from "./modules/getPluginConfig"
import { toHtml } from "./modules/toHtml"
import Display from "./components/Display.svelte"
import Preview from "./components/Preview.svelte"
;((PLUGIN_ID) => {
  kintone.events.on(
    ["app.record.detail.show", "mobile.app.record.detail.show"],
    async (eventObject: KintoneEventObject) => {
      const config = getPluginConfig(PLUGIN_ID)
      const { record } = eventObject
      await Promise.all(
        config.targetFields.map(async (fieldCode) => {
          const html = await toHtml(record[fieldCode].value as string, config.userData)
          const el = getFieldElement(fieldCode)
          const containerEl = el?.parentElement
          const selector = ".control-value-gaia"
          if (containerEl) {
            containerEl.setAttribute("class", containerEl.getAttribute("class") + " yomiyasuin")
            new Display({
              target: containerEl,
              props: {
                html,
                containerEl: containerEl,
                valueSelector: selector,
              },
            })
            containerEl.querySelector(selector)?.setAttribute("aria-hidden", "true")
            containerEl.querySelector(selector)?.setAttribute("style", "display: none;")
          }
        })
      )
      return eventObject
    }
  )

  kintone.events.on(
    ["app.record.create.show", "app.record.edit.show", "app."],
    async (eventObject: KintoneEventObject) => {
      const config = getPluginConfig(PLUGIN_ID)
      config.targetFields.map((fieldCode) => {
        const el = getFieldElement(fieldCode)
        // previewコンポーネントにわたす
        const containerEl = el?.parentElement
        new Preview({
          target: containerEl,
          props: {
            fieldCode,
            userData: config.userData,
            containerEl: containerEl,
          },
        })
      })
      return eventObject
    }
  )

  function getFieldElement(fieldCode: string) {
    let fieldEl = kintone.app.record.getFieldElement(fieldCode)
    if (fieldEl) return fieldEl
    const fieldList = window.cybozu.data.page.FORM_DATA.schema.table.fieldList
    const field = Object.values(fieldList).find((field) => field.var === fieldCode)
    if (!field) return null
    fieldEl = document.querySelector(`.value-${field.id}`)
    return fieldEl
  }
})(kintone.$PLUGIN_ID)
