<script setup lang="ts">
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ofetch } from "ofetch";
import { ref } from "vue";
import * as cheerio from "cheerio";
import { useClipboard } from "@vueuse/core";

const content = ref("");
const { copy, copied } = useClipboard();
const isLoading = ref(false);
const form = ref({
  link: "https://www.instagram.com/reel/DITiF7nSzHj/?igsh=MXN1dWt5amFqc2UwdQ==",
});
const submit = async () => {
  isLoading.value = true;
  try {
    const link = form.value.link.replace(
      "https://www.instagram.com/",
      "/api/ig-caption/"
    );
    const response = await ofetch(link, {
      responseType: "text",
    });

    const $ = cheerio.load(response);
    const metaTagContent = $('meta[name="description"]').attr("content");
    if (metaTagContent) {
      content.value = metaTagContent;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div>
    <form
      @submit.prevent="submit"
      class="grid grid-cols-8 my-4 px-4 mx-auto max-w-2xl gap-4"
    >
      <Input v-model="form.link" class="lg:col-span-6 col-span-full" />

      <div class="lg:col-span-2 col-span-full">
        <Button :isLoading class="w-full">Submit</Button>
      </div>
    </form>
    <div
      v-if="content"
      class="bg-muted rounded-2xl py-6 relative whitespace-pre-line mx-auto px-4 max-w-2xl"
    >
      <Button class="absolute top-4 right-4" @click="copy(content)">
        {{ copied ? "Copied!" : "Copy" }}
      </Button>
      {{ content }}
    </div>
  </div>
</template>
