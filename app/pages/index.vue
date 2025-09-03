<script setup lang="ts">
const content = ref("");
const updateContent = (value: string) => {
  content.value = value;
};
</script>
<template>
  <Form @update:content="updateContent" />
  <Content :value="content" />
</template>
