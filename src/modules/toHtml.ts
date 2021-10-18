import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import { plugin, handlers } from "./yomiyasuin"
import remarkBreaks from "remark-breaks"
import rehypeExternalLinks from "rehype-external-links"

export const toHtml = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(plugin)
    .use(remarkBreaks)
    .use(remarkRehype, {
      handlers,
    })
    .use(rehypeExternalLinks)
    .use(rehypeStringify)
    .process(markdown)
  return result.value as string
}
