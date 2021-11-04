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
      html = html.replace(
        link.textContent,
        `<a href="${link.getAttribute("href")}" target="_blank">${link.textContent}</a>`
      )
    })
    return html
  }

  $: autoLinkedHtml = replaceAutoLinks(html)
</script>

<div class="yomiyasuin-display">
  <!--  <div class="yomiyasuin-switch">-->
  <!--    <label>-->
  <!--      HTML <input-->
  <!--        type="checkbox"-->
  <!--        on:click={onClick}-->
  <!--        checked={isShown}-->
  <!--        aria-label="display as HTML"-->
  <!--      />-->
  <!--    </label>-->
  <!--  </div>-->
  <!--  {#if isShown}-->
  <div class="yomiyasuin-html">{@html autoLinkedHtml}</div>
  <!--  {/if}-->
</div>

<style>
  .yomiyasuin-display {
    margin: 0 8px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    min-width: 80px;
  }
  .yomiyasuin-switch {
    position: absolute;
    right: 8px;
    top: 8px;
    white-space: nowrap;
    z-index: 10;
  }
  .yomiyasuin-html {
    padding: 8px;
    background-color: #eee;
    box-sizing: border-box;
    border: 1px solid #d8d8d8;
  }
</style>
