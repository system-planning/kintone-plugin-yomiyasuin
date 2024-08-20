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
      if(!config.targetSpaceFields.length) return eventObject
      const spaceField = config.targetSpaceFields[0]
      const spaceEl = kintone.app.record.getSpaceElement(spaceField)
      if (!spaceEl) return eventObject
      // 添付画像のサムネイル要素を取得する
      const thumbnails = document.getElementsByClassName("gaia-ui-slideshow-thumbnail")
      if (!thumbnails.length) return eventObject
      spaceEl.setAttribute('class', 'files-space')
      // 添付ごとにマークダウン用URLを格納するinput要素を作成する
      for (const [index, thumbnail] of Object.entries(thumbnails)) {
        const containerEl = createElement(spaceEl, 'div', 'files-lbl-' + index)
        containerEl.textContent = thumbnail["title"]

        const varUrl = thumbnail["src"].match(/^https:\/\/(.+?):?(d+)?(\/.*)?$/)[3]
        const inputEl = createElement(spaceEl, 'input', 'files-url-' + index)
        inputEl.value = getMarkUpImgUrl(varUrl, thumbnail["title"])
        inputEl.setAttribute('class', 'files-url')
        inputEl.setAttribute("style", "width: 250px; margin-bottom: 12px;")
      }

      // フォーカス時、クリック時に選択状態にする
      document.querySelectorAll('.files-url').forEach(function (element) {
        element.addEventListener('focus', function () {
          this.select()
        })

        element.addEventListener('click', function (event) {
          this.select()
          event.preventDefault()
        })
      })
      
      return eventObject
    }
  )

  function createElement(parent, element, id) {
    const el = document.createElement(element)
    el.id = id
    parent.appendChild(el)
    return el
  }

  function getMarkUpImgUrl(url: string, title: string): string {
    const pars = ['field', 'id', 'app', 'record', 'hash', 'row']
    const aryUrl = url.split('&')
    let markUrl: string[] = []
  
    markUrl.push(aryUrl[0])
    for (let i = 1; i < aryUrl.length; i++) {
      const sep = aryUrl[i].split('=')
      if (pars.indexOf(sep[0]) > -1) {
        markUrl.push(aryUrl[i])
      }
    }
  
    const result = `![${title}](${markUrl.join('&')}&.png)`
    return result
  }  

  kintone.events.on(
    ["app.record.create.show", "app.record.edit.show"],
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
