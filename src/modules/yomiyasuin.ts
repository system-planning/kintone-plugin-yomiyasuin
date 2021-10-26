import remarkParse from "remark-parse"
import type { Plugin } from "unified"
import type { Node, Parent, Literal } from "unist"
import type { Paragraph, Text, Image } from "mdast"
import type { VFileCompatible } from "vfile"
import type { MdastNode, Handler, H } from "mdast-util-to-hast/lib"
import { visit } from "unist-util-visit"
import { all } from "mdast-util-to-hast"
import { unified } from "unified"
import remarkGfm, { Root } from "remark-gfm"
import remarkRehype from "remark-rehype"
import { toString } from "mdast-util-to-string"
import remarkBreaks from "remark-breaks"
import { toHast } from "mdast-util-to-hast/lib"
import { toHtml } from "hast-util-to-html"
import rehypeRaw from "rehype-raw"

export const plugin: Plugin = ({ userData }: { userData: any }) => {
  return (tree: Node, _file: VFileCompatible) => {
    visit(tree, isGijiroku, createVisitor(userData))
  }
}

export const handlers: Record<string, Handler> = {
  yomiyasuin: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "div",
      properties: {
        class: ["yomiyasuin-content"],
      },
      children: [...all(h, node)],
    }
  },
  line: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "p",
      properties: {
        class: ["yomiyasuin-line"],
      },
      children: [...all(h, node)],
    }
  },
  name: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "b",
      properties: {
        class: ["yomiyasuin-name"],
      },
      children: [...all(h, node)],
    }
  },
  // @ts-ignore
  selif: (h: H, node: MdastNode) => {
    const processer = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, {
        allowDangerousHtml: true,
      })
      .use(rehypeRaw)
    // @ts-ignore
    const mdast = processer.parse(node.children[0].value)
    // @ts-ignore
    const hast = processer.runSync(mdast.children[0])

    return {
      type: "element",
      tagName: "span",
      properties: {
        class: ["yomiyasuin-selif"],
      },
      // @ts-ignore
      children: hast.children,
    }
  },
  icon: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "img",
      properties: {
        class: ["yomiyasuin-icon"],
        src: (node as Image).url,
        alt: "",
      },
      children: [...all(h, node)],
    }
  },
  // @ts-ignore
  paragraph: (h: H, node: MdastNode) => {
    const partialMd = toString(node)
    const processer = unified().use(remarkBreaks).use(remarkParse).use(remarkGfm).use(remarkRehype)
    const mdast = processer.parse(partialMd)
    const hast = processer.runSync(mdast)
    return hast
  },
}

function createVisitor(userData: any) {
  return function visitor(node: Paragraph, index: number, parent: Parent | undefined) {
    // @ts-ignore
    const partialMd = toHtml(toHast(node).children)

    let cursor = -1
    const lines = partialMd.split("\n").reduce<string[]>((ret, line) => {
      if (/.+[：]/.test(line)) {
        cursor++
      }
      if (!ret[cursor]) {
        ret[cursor] = ""
      }
      ret[cursor] += `${line.trimLeft()}`
      return ret
    }, [])

    const defaultIcon = "https://static.cybozu.com/contents/k/image/icon/user/user_32.svg"
    const mapData = new Map()
    userData.forEach(({ name, id }) => {
      mapData.set(name, { name, id })
    })

    function buildUserIconUrl(name) {
      if (!mapData.get(name)?.id) return defaultIcon
      return `/api/user/photo.do/-/user.png?id=${mapData.get(name)?.id}&size=SIZE_96_R&.png`
    }

    const gijiroku = lines.map((line) => {
      const [name, selif] = line.split("：")
      return {
        type: "line",
        children: [
          {
            type: "icon",
            url: buildUserIconUrl(name),
          },
          {
            type: "name",
            children: [
              {
                type: "text",
                value: name,
              },
            ],
          },
          {
            type: "selif",
            children: [
              {
                type: "text",
                value: selif,
              },
            ],
          },
        ],
      }
    })
    // @ts-ignore
    node.type = "yomiyasuin"
    // @ts-ignore
    node.children = gijiroku
  }
}

const isGijiroku = (node: unknown): node is Paragraph => {
  if (!isParagraph(node)) return false
  const { children } = node

  const firstChild = children[0]
  if (!isText(firstChild)) return false
  let cursor = -1
  firstChild.value.split("\n").forEach((line) => {
    if (/.+[：]/.test(line)) {
      cursor++
    }
  }, [])

  return cursor > 0
}

function isObject(target: unknown): target is { [key: string]: unknown } {
  return typeof target === "object" && target !== null
}

function isNode(node: unknown): node is Node {
  return isObject(node) && "type" in node
}

function isLiteral(node: unknown): node is Literal {
  return isObject(node) && "value" in node
}

function isParagraph(node: unknown): node is Paragraph {
  return isNode(node) && node.type === "paragraph"
}

function isText(node: unknown): node is Text {
  return isLiteral(node) && node.type === "text" && typeof node.value === "string"
}
