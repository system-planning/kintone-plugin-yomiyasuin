import type { Plugin } from "unified"
import type { Node, Parent, Literal } from "unist"
import type { Paragraph, Text } from "mdast"
import type { VFileCompatible } from "vfile"
import type { MdastNode, Handler, H } from "mdast-util-to-hast/lib"
import { visit } from "unist-util-visit"
import { all } from "mdast-util-to-hast"

export const plugin: Plugin = () => {
  return (tree: Node, _file: VFileCompatible) => {
    visit(tree, isGijiroku, visitor)
  }
}

export const handlers: Record<string, Handler> = {
  yomiyasuin: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "div",
      properties: {
        class: ["yomiyasuin"],
      },
      children: [...all(h, node)],
    }
  },
  b: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "b",
      properties: {
        class: ["yomiyasuin-name"],
      },
      children: [...all(h, node)],
    }
  },
  span: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "span",
      properties: {
        class: ["yomiyasuin-selif"],
      },
      children: [...all(h, node)],
    }
  },
  image: (h: H, node: MdastNode) => {
    return {
      type: "element",
      tagName: "img",
      properties: {
        class: ["yomiyasuin-icon"],
      },
      children: [...all(h, node)],
    }
  },
}

function visitor(node: Paragraph, index: number, parent: Parent | undefined) {
  const firstChild = node.children[0]
  if (!isText(firstChild)) return

  let cursor = -1
  const lines = firstChild.value.split("\n").reduce<string[]>((ret, line) => {
    if (/.+[：]/.test(line)) {
      cursor++
    }
    if (!ret[cursor]) {
      ret[cursor] = ""
    }
    ret[cursor] += `${line.trimLeft()}`
    return ret
  }, [])

  const gijiroku = lines.map((line) => {
    const [name, selif] = line.split("：")
    return {
      type: "paragraph",
      children: [
        {
          type: "image",
          position: {},
          alt: "",
          url: "https://static.cybozu.com/contents/k/image/icon/user/user_32.svg",
        },
        {
          type: "b",
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
          type: "span",
          children: [
            {
              type: "text",
              value: selif,
              position: {},
            },
          ],
        },
      ],
      position: {},
    }
  })
  // @ts-ignore
  node.type = "yomiyasuin"
  // @ts-ignore
  node.children = gijiroku
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
