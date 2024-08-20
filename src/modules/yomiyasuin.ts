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
import { combiineToLines } from "./combineToLines"

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
    let flgImage
    const children = node.children.flatMap(child => {
      if (child.type === 'image') {
          flgImage = true
          return h(child, 'img', {
              src: child.url,
              alt: child.alt || '',
              title: child.title || '',
          })
      } else if (child.type === 'text') {
        // 改行を適切に処理するために、改行を<br>に変換
        const lines = child.value.split('\n')
        return lines.flatMap((line, index) => {
            // https を含んでいるかどうかを確認
            if (line.includes('https')) {
                // https を含んでいる場合、部分的に分割して処理
                const parts = line.split(/(https?:\/\/[^\s]+)/g)
                const partNodes = parts.flatMap(part => {
                    if (/https?:\/\/[^\s]+/.test(part)) {
                        // URL部分は <a> タグに変換
                        return { type: 'element', tagName: 'a', properties: { href: part }, children: [{ type: 'text', value: part }] }
                    } else {
                        // それ以外は通常のテキストとして処理
                        return { type: 'text', value: part }
                    }
                })
                if (index < lines.length - 1) {
                    // 行末でなければ <br> を追加
                    partNodes.push({ type: 'element', tagName: 'br', properties: {}, children: [] })
                }
                return partNodes
            } else {
                // https を含んでいない場合、通常のテキスト処理と <br> 処理を行う
                const lineNode = { type: 'text', value: line }
                if (index < lines.length - 1) {
                    return [
                        lineNode,
                        { type: 'element', tagName: 'br', properties: {}, children: [] }
                    ]
                } else {
                    return lineNode
                }
            }
        })
    } else {
          // 他の要素はそのまま処理
          return h(child, all(h, child))
      }
    })
    if (flgImage) return h(node, 'p', children)
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

    const lines = combiineToLines(partialMd)

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
                // リスト記法が来ると無視されるのでパッチ対応。数値のリストだけ対応してる
                value: selif.replace(/\d\.\s/g, (matched) => matched.replace(/\.\s/g, "．")),
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

  return cursor >= 0
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
