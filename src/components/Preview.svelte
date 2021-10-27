<script lang="ts">
  import { toHtml } from "../modules/toHtml"
  import type { User } from "../types"

  export let containerEl: HTMLElement
  export let fieldCode: string
  export let userData: User[]

  let isShown: boolean = false
  let html: string = ""

  const showPreview = async () => {
    const md = kintone.app.record.get().record[fieldCode].value
    html = await toHtml(md, userData)
    isShown = true
  }
  const closePreview = () => {
    isShown = false
  }
</script>

<div class="yomiyasuin-preview">
  <button on:click={showPreview}>Preview HTML</button>
  {#if isShown}
    <div class="yomiyasuin-previewDialog">
      <div class="yomiyasuin-overlay">
        <div class="yomiyasuin-previewHeading">
          HTML Preview
          <button on:click={closePreview} class="yomiyasuin-closeButton">close</button>
        </div>
        <div class="yomiyasuin-html">{@html html}</div>
      </div>
    </div>
  {/if}
</div>

<style>
  .yomiyasuin-previewDialog {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    box-sizing: border-box;
    padding: 64px;
  }

  .yomiyasuin-overlay {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    background-color: #fff;
    padding: 16px;
    max-width: 800px;
  }
  .yomiyasuin-previewHeading {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  .yomiyasuin-closeButton {
    margin-left: auto;
    font-size: 14px;
    font-weight: normal;
  }
  .yomiyasuin-html {
    padding: 8px;
    background-color: #eee;
    box-sizing: border-box;
    border: 1px solid #d8d8d8;
    overflow: auto;
  }
</style>
