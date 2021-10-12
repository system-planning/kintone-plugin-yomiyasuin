import type { KintoneRecordField, KintoneFormFieldProperty } from "@kintone/rest-api-client"

export type KintoneRecord = {
  [k: string]: KintoneRecordField.OneOf & { disabled?: boolean; error?: string }
}

export type FieldProperties = Record<string, KintoneFormFieldProperty.OneOf>

export type FieldsJson = {
  properties: FieldProperties
}

export type PluginConfig = {
  targetFields: string[]
}

export type KintoneEventObject = {
  record: KintoneRecord
}
