<script lang="ts">
  import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";

  // カスタム型を定義して、SPACERフィールドに対応
  interface SpacerField {
    type: 'SPACER';
    elementId: string;
    [key: string]: any; // 他のプロパティを柔軟に扱うため
  }

  export let properties: (KintoneFormFieldProperty.OneOf | SpacerField)[];
  export let value: string[] = [];
  export let handleChange: (e: any) => void;

  // SPACERフィールドをフィルタリング
  const spaceFields = properties.filter(
    (property): property is SpacerField => property.type === 'SPACER'
  );

  // 選択されたフィールドを保持
  let selectedFields: string[] = value;

  const onSelectChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    selectedFields = Array.from(target.selectedOptions).map((option) => option.value);
    value = selectedFields; // 選択された値をvalueに設定
    handleChange(e);
  };
</script>

<div class="fields-selector">
  <select bind:value={value} name="" id="" size={spaceFields.length} multiple on:change={onSelectChange}>
    {#each spaceFields as property}
      <option value={property.elementId}>{property.elementId}</option>
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
