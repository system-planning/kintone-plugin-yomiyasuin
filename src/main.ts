import { convertToTable } from "./modules/convertToTable"
import type { KintoneEventObject } from "./types"
import { getPluginConfig } from "./modules/getPluginConfig"
import type { Transformer } from "unified"
import { unified } from "unified"
import type { Node } from "unist"
import type { Root } from "mdast"
import { remark } from "remark"
import remarkHtml from "remark-html"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import remarkExternalLinks from "remark-external-links"
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
          console.log(fieldCode)
          console.log(await unified().use)
          const result = await remark()
            .use(remarkParse)
            .use(plugin)
            // .use(remarkRehype, { allowDangerousHtml: true })
            // .use(rehypeRaw)
            .use(remarkExternalLinks, { target: "_blank", rel: ["nofollow"] })
            .use(remarkHtml)
            .process(record[fieldCode].value as string)
          console.log(result.value)
          const el = kintone.app.record.getFieldElement(fieldCode)
          if (el) {
            const start = new RegExp("&#x3C;", "g")
            el.innerHTML = (result.value as string).replace(start, "<")
            // el.innerHTML = result.value as string
          }
        })
      )
      return eventObject
    }
  )
  // @ts-ignore
})(kintone.$PLUGIN_ID)

const plugin: () => Transformer = () => {
  const transformer: Transformer = (tree: Node) => {
    const root = tree as Root
    root.children.forEach((node, index) => {
      console.log(node)
      if (node.type !== "paragraph") return
      if (node.children[0].type === "text" && isGijiroku(node.children[0].value)) {
        // @ts-ignore
        node.children = convert(node.children[0].value)
        // @ts-ignore
        node.type = "element"
      }
    })
    return root
  }
  return transformer
}

const isGijiroku = (src: string) => {
  let cursor = -1
  const lines = src.split("\n").reduce<string[]>((ret, line) => {
    if (/.+[：]/.test(line)) {
      cursor++
    }
    if (!ret[cursor]) {
      ret[cursor] = ""
    }
    ret[cursor] += `${line.trimLeft()}`
    return ret
  }, [])

  return lines.length > 1
}

const convert = (src: string) => {
  let cursor = -1
  const lines = src.split("\n").reduce<string[]>((ret, line) => {
    if (/.+[：]/.test(line)) {
      cursor++
    }
    if (!ret[cursor]) {
      ret[cursor] = ""
    }
    ret[cursor] += `${line.trimLeft()}`
    return ret
  }, [])

  if (lines.length <= 1) return src

  return lines.map((line) => {
    const [name, selif] = line.split("：")
    return {
      type: "paragraph",
      children: [
        {
          type: "image",
          position: {},
          url: "https://static.cybozu.com/contents/k/image/icon/user/user_32.svg",
        },
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: name,
              position: {},
            },
          ],
          position: {},
        },
        {
          type: "text",
          value: selif,
          position: {},
        },
      ],
      position: {},
    }
  })
}
