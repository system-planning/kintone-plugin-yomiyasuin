<script lang="ts">
  import TargetFieldsSelector from "./components/TargetFieldsSelector.svelte"
  import type { FieldProperties, PluginConfig } from "./types"
  export let properties: FieldProperties
  export let config: PluginConfig
  let selectedFields = config.targetFields

  console.log(config)

  const onSelectTargetFields = (e) => {
    const target = e.target as HTMLSelectElement
    selectedFields = Array.from(target.options)
      .filter((el) => el.selected)
      .map((el) => el.value)
  }

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
  <form
    class="js-submit-settings"
    on:submit={(e) => {
      e.preventDefault()
      console.log(selectedFields)
      kintone.plugin.app.setConfig({
        targetFields: JSON.stringify(selectedFields),
      })
    }}
  >
    <TargetFieldsSelector
      properties={filterdProperties}
      handleChange={onSelectTargetFields}
      value={selectedFields}
    />
    <button>submit</button>
  </form>
</section>

<style>
  .settings {
    font-size: 16px;
  }
</style>
