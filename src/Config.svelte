<script lang="ts">
  import TargetFieldsSelector from "./components/TargetFieldsSelector.svelte"
  import type { FieldProperties, PluginConfig } from "./types"
  import UserDataEditor from "./components/UserDataEditor.svelte"
  export let properties: FieldProperties
  export let config: PluginConfig
  let selectedFields = config.targetFields
  let userData = config.userData
  let errorMessage = ""

  const onSelectTargetFields = (e) => {
    const target = e.target as HTMLSelectElement
    selectedFields = Array.from(target.options)
      .filter((el) => el.selected)
      .map((el) => el.value)
  }

  $: filteredProperties = properties
    ? Object.entries(properties)
        .filter(([_, property]) => {
          return property.type === "MULTI_LINE_TEXT"
        })
        .map(([_, property]) => property)
    : []

  const updateUserData = (newUserData) => {
    userData = newUserData
  }

  const addUserData = () => {
    userData = [
      ...userData,
      {
        name: "",
        id: "",
      },
    ]
  }

  const removeUserData = ({ index }) => {
    userData.splice(index, 1)
    userData = [...userData]
  }

  const submit = (e) => {
    e.preventDefault()
    errorMessage = ""
    try {
      kintone.plugin.app.setConfig({
        ...config,
        targetFields: JSON.stringify(selectedFields),
        userData: JSON.stringify(userData),
      })
    } catch (e) {
      errorMessage = e.message
    }
  }
</script>

<section class="settings">
  <h2 class="settings-heading">Settings for Yomiyasuin plugin</h2>
  <form class="js-submit-settings" on:submit={submit}>
    <section class="targetFields">
      <h3 class="heading">Target Fields</h3>
      <TargetFieldsSelector
        properties={filteredProperties}
        handleChange={onSelectTargetFields}
        value={selectedFields}
      />
    </section>
    <section class="userData">
      <h3 class="heading">User Data</h3>
      <UserDataEditor
        handleAddUser={addUserData}
        handleUpdateUserData={updateUserData}
        handleRemoveUser={removeUserData}
        {userData}
        userDataString={JSON.stringify(userData, null, 2)}
      />
    </section>
    <div class="buttons">
      <button class="submitButton">Save</button>
      <div class="errorMessage">
        {#if errorMessage}
          <div>{errorMessage}</div>
        {/if}
      </div>
    </div>
  </form>
</section>

<style>
  .heading {
    margin-bottom: 8px;
  }
  .settings {
    font-size: 16px;
  }
  .targetFields {
    margin-top: 24px;
  }
  .userData {
    margin-top: 24px;
    font-size: 14px;
  }
  .errorMessage {
    color: tomato;
    padding: 16px;
    font-size: 12px;
    min-height: 1.2em;
  }
  .buttons {
    padding: 8px;
    text-align: center;
  }
  .submitButton {
    font-weight: normal;
    font-size: 14px;
    border-radius: 0;
    padding: 8px;
    color: #fff;
    background-color: #3498db;
    border: 1px solid #efefef;
    text-decoration: none;
    cursor: pointer;
    line-height: 1;
  }
</style>
