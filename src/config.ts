import Config from "./Config.svelte"
;((PLUGIN_ID) => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID)
  console.log(config)
  const app = new Config({
    target: document.querySelector("#config"),
    props: {
      name: "config dayo",
    },
  })

  // @ts-ignore
})(kintone.$PLUGIN_ID)
