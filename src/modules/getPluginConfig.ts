import type { PluginConfig } from "../types"

export const getPluginConfig = (PLUGIN_ID: string): PluginConfig => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID)
  return {
    ...config,
    targetFields: JSON.parse(typeof config.targetFields === "string" ? config.targetFields : "[]"),
    userData: JSON.parse(typeof config.userData === "string" ? config.userData : "[]"),
  }
}
