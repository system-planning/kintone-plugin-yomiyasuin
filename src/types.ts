import type { KintoneRecordField, KintoneFormFieldProperty } from "@kintone/rest-api-client"

export type KintoneRecord = {
  [k: string]: KintoneRecordField.OneOf & { disabled?: boolean; error?: string }
}

export type FieldProperties = Record<string, KintoneFormFieldProperty.OneOf>

export type FieldsJson = {
  properties: FieldProperties
}

export type User = {
  id: string
  name: string
}

export type PluginConfig = {
  targetFields: string[]
  userData: User[]
}

export type KintoneEventObject = {
  record: KintoneRecord
}

declare global {
  interface Window {
    cybozu: {
      data: {
        page: {
          FORM_DATA: {
            schema: {
              table: {
                fieldList: Record<
                  string,
                  {
                    id: string
                    var: string
                  }
                >
              }
            }
          }
        }
      }
    }
  }
}
