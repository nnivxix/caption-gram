<script setup lang="ts">
import { ref } from "vue";
import Form from "./components/Form.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import Content from "./components/Content.vue";
import { Toaster } from "./components/ui/sonner";

const content = ref("");
const updateContent = (value: string) => {
  content.value = value;
};
</script>
<template>
  <div class="flex flex-col min-h-[95vh] px-4">
    <Header />
    <Form @update:content="updateContent" />
    <Content :value="content" />
    <Footer />
    <Toaster richColors />
  </div>
</template>
