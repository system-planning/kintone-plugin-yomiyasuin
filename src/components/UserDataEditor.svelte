<script lang="ts">
  import type { User } from "../types"
  export let userData: User[]
  export let userDataString: string
  export let handleUpdateUserData: (json) => void
  export let handleAddUser: () => void
  export let handleRemoveUser: ({ index: number }) => void
  let inputEl

  const onChangeUserDataString = (e) => {
    const target = e.target as HTMLTextAreaElement
    userDataString = target.value
    try {
      const parserUserData = JSON.parse(userDataString)
      handleUpdateUserData(parserUserData)
    } catch (e) {}
  }

  const updateUserName = ({ name, index }: { name: string; index: number }) => {
    userData.splice(index, 1, {
      ...userData[index],
      name,
    })
    userData = [...userData]
    handleUpdateUserData(userData)
  }
  const updateUserId = ({ id, index }: { id: string; index: number }) => {
    userData.splice(index, 1, {
      ...userData[index],
      id,
    })
    userData = [...userData]
    handleUpdateUserData(userData)
  }

  const download = (e) => {
    const target = e.target as HTMLAnchorElement
    target.href = URL.createObjectURL(
      new Blob([JSON.stringify(userData, null, 2)], {
        type: "application/octet-stream",
      })
    )
  }

  const onClickLoadFile = () => {
    inputEl?.click()
  }

  const onSelectFile = (e) => {
    if (!e.currentTarget.files) return
    const file = e.currentTarget.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string)
        handleUpdateUserData(json)
        inputEl?.value = ""
      } catch (err) {
        alert(err.message)
      }
    }
    reader.readAsText(file)
  }
</script>

<div class="options">
  <div class="userDataList">
    <table class="userDataTable">
      <thead>
        <tr>
          <th>name</th>
          <th>id</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each userData as { name, id }, index}
          <tr>
            <td class="userDataTable_name">
              <input
                type="text"
                value={name}
                aria-label="name"
                on:change={(e) => updateUserName({ name: e.target.value, index })}
              />
            </td>
            <td class="userDataTable_id">
              <input
                type="text"
                value={id}
                aria-label="id"
                on:change={(e) => updateUserId({ id: e.target.value, index })}
              />
            </td>
            <td class="userDataTable_button">
              <button type="button" aria-label="remove" on:click={handleRemoveUser({ index })}>
                ❌
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="addButton">
      <button type="button" class="actionButton small" on:click={handleAddUser}>add</button>
    </div>
  </div>
  <div class="userDataString">
    <textarea bind:value={userDataString} on:change={onChangeUserDataString} />
  </div>
  <div class="buttons">
    <button class="actionButton loadFileButton" on:click={onClickLoadFile}>
      Load from file
      <input type="file" bind:this={inputEl} on:change={onSelectFile} accept=".json,.txt" />
    </button>
    <a on:click={download} download="yomiyasuin.json" href="#" class="actionButton">Download </a>
  </div>
</div>

<style>
  .options {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 8px;
    box-sizing: border-box;
  }
  .userDataString {
    height: 100%;
  }
  .userDataString textarea {
    width: 100%;
    height: 100%;
    border-color: #b4b4b4;
    padding: 8px;
    box-sizing: border-box;
  }
  .userDataTable {
    border: 1px solid #b4b4b4;
    width: 100%;
    box-sizing: border-box;
  }
  .userDataTable td,
  .userDataTable th {
    padding: 8px;
  }

  .userDataTable th {
    font-size: 12px;
    background-color: #3498db;
    color: #fff;
  }

  .userDataTable tr:nth-of-type(2n) {
    background-color: rgb(234, 234, 234);
  }
  .userDataTable_name {
    width: 70%;
    border-top: 1px solid #b4b4b4;
    border-right: 1px solid #b4b4b4;
  }
  .userDataTable_id {
    border-top: 1px solid #b4b4b4;
    border-right: 1px solid #b4b4b4;
  }
  .userDataTable_button {
    border-top: 1px solid #b4b4b4;
    text-align: center;
  }
  .userDataTable_button button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 12px;
  }
  .userDataTable input {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid transparent;
  }
  .userDataTable input:focus,
  .userDataTable input:hover {
    border-bottom-color: #d4d4d4;
  }
  .addButton {
    margin-top: 16px;
    text-align: center;
  }
  .userDataString {
    min-height: 400px;
  }

  .actionButton {
    font-weight: normal;
    font-size: 14px;
    padding: 8px;
    color: #3498db;
    border: 1px solid #3498db;
    background-color: transparent;
    text-decoration: none;
    cursor: pointer;
    line-height: 1;
    border-radius: 2px;
  }
  .actionButton:hover {
    background-color: #3498db;
    color: #fff;
  }
  .actionButton + .actionButton {
    margin-left: 16px;
  }
  .buttons {
    grid-column: 1/3;
    text-align: right;
  }
  .loadFileButton input {
    display: none;
  }
</style>
