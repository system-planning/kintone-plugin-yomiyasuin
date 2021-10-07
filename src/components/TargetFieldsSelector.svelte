<script lang="ts">
  export let title: string;
  export let description: string;
</script>

<div class="plugin-row">
  <div class="plugin-label">{title}</div>
  <div class="plugin-select-outer">
    <div class="plugin-select">
      <select id="markdown_files_value">
        <option multiple value="">--</option>
      </select>
    </div>
  </div>
  <div class="plugin-desc">{description}</div>
</div>

<style>
  .plugin-row {
    margin-top: 24px;
  }
  .plugin-label {
    margin-bottom: 8px;
    font-weight: bold;
  }
</style>