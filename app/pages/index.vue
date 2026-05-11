<script setup lang="ts">
const content = ref("");
const updateContent = (value: string) => {
  content.value = value;
};
</script>
<template>
  <ClientOnly>
    <Form @update:content="updateContent" />
  </ClientOnly>
  <Content :value="content" />
</template>
