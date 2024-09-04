<script lang="ts">
  export let containerEl: HTMLElement
  export let valueSelector: string
  export let html: string
  let isShown: boolean = false
  const onClick = (e) => {
    isShown = e.target.checked
    const valueEl = containerEl?.querySelector(valueSelector)
    if (!valueEl) return
    valueEl.setAttribute("aria-hidden", isShown ? "true" : "false")
  }

  // アプリコードの自動リンクを反映
  const replaceAutoLinks = (html: string) => {
    const valueEl = containerEl.querySelector(valueSelector)
    if (!valueEl) return html
    const links = valueEl.querySelectorAll('[itemprop="autolink"]')
    const autoLinks = Array.from(links).filter((link) => {
      return /^[a-z|A-Z]+[a-z|A-Z|0-9]?-[0-9]+$/.test(link.textContent)
    })
    autoLinks.forEach((link) => {
      html = html.replaceAll(
        link.textContent,
        `<a href="${link.getAttribute("href")}" target="_blank">${link.textContent}</a>`
      )
    })
    return html
  }

  $: autoLinkedHtml = replaceAutoLinks(html)
</script>

<div class="yomiyasuin-display">
  <div class="yomiyasuin-html">{@html autoLinkedHtml}</div>
</div>

<style>
  .yomiyasuin-display {
    min-width: 80px;
  }
  .yomiyasuin-html {
    padding: 8px;
    background-color: #eee;
    box-sizing: border-box;
    border: 1px solid #d8d8d8;
  }
</style>
