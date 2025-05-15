<script setup lang="ts">
import { ref } from "vue";
import Footer from "./components/Footer.vue";
import Content from "./components/Content.vue";
import Form from "./components/Form.vue";

const content = ref("");
const updateContent = (value: string) => {
  content.value = value;
};
</script>
<template>
  <div class="flex flex-col min-h-[95vh]">
    <Form @update:content="updateContent" />
    <Content :value="content" />
    <Footer />
  </div>
</template>
