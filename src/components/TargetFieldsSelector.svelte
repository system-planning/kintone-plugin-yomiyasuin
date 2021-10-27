<script lang="ts">
  import type { KintoneFormFieldProperty } from "@kintone/rest-api-client"
  export let properties: KintoneFormFieldProperty.OneOf[]
  export let value = []
  export let handleChange: (e: any) => void
</script>

<div class="fields-selector">
  <select {value} name="" id="" size={properties.length} multiple on:change={handleChange}>
    {#each properties as property}
      <option value={property.code}>{property.code}</option>
    {/each}
  </select>
</div>

<style>
  .fields-selector select {
    border-color: #b4b4b4;
    font-size: 14px;
    min-width: 200px;
  }
  .fields-selector option {
    padding: 4px;
  }
</style>
