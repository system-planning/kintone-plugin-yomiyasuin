import App from "./App.svelte"
;((PLUGIN_ID) => {
  kintone.events.on(
    ["app.record.detail.show", "app.record.create.show", "app.record.edit.show"],
    () => {
      const config = kintone.plugin.app.getConfig(PLUGIN_ID)
      console.log(config)
      console.log(PLUGIN_ID)
      new App({
        target: document.body,
        props: {
          name: "plugin",
        },
      })
    }
  )
  // @ts-ignore
})(kintone.$PLUGIN_ID)
