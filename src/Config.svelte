<script lang="ts">
  import type { FieldProperties } from "./types"
  export let properties: FieldProperties

  $: filterdProperties = properties
    ? Object.entries(properties)
        .filter(([_, property]) => {
          return property.type === "MULTI_LINE_TEXT"
        })
        .map(([_, property]) => property)
    : []
</script>

<section class="settings">
  <h2 class="settings-heading">Settings for plugin</h2>
  <form class="js-submit-settings">
    <select name="" id="" size={filterdProperties.length} multiple>
      {#each filterdProperties as property}
        <option>{property.code}</option>
      {/each}
    </select>
  </form>
</section>

<style>
  .settings {
    font-size: 16px;
  }
</style>
