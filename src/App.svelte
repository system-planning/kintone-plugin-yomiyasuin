<script lang="ts">
  export let html: string
</script>

<div class="yomiyasuin-wrapper markdown-body">
  {@html html}
</div>

<style>
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
