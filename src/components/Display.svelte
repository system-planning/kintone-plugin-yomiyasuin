<script lang="ts">
  export let html: string
  let isShown: boolean = false
  const onClick = (e) => {
    isShown = e.target.checked
  }
</script>

<div class="yomiyasuin-display">
  <div class="yomiyasuin-switch">
    HTML <input type="checkbox" on:click={onClick} checked={isShown} />
  </div>
  {#if isShown}
    <div class="yomiyasuin-html markdown-body">{@html html}</div>
  {/if}
</div>

<style>
  .yomiyasuin-display {
    margin: 0px 8px;
    position: absolute;
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
  }
  .yomiyasuin-html {
    padding: 8px;
    background-color: #eee;
    box-sizing: border-box;
    border: 1px solid #d8d8d8;
  }
</style>
