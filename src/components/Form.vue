<script setup lang="ts">
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ofetch } from "ofetch";
import { ref } from "vue";
import * as cheerio from "cheerio";
import { toast } from "vue-sonner";

const emit = defineEmits<{
  "update:content": [value: string];
}>();

const isLoading = ref(false);
const form = ref({
  link: "",
});
const submit = async () => {
  isLoading.value = true;
  try {
    if (!form.value.link) {
      throw new Error("Please enter a link");
    }
    if (!form.value.link.includes("instagram.com")) {
      throw new Error("Please enter a valid Instagram link");
    }
    const link = form.value.link.replace(
      "https://www.instagram.com/",
      "/api/ig-caption/"
    );
    const response = await ofetch(link, {
      responseType: "text",
    });

    const $ = cheerio.load(response);
    const metaTagContent = $('meta[name="description"]').attr("content");
    if (!metaTagContent) {
      throw new Error("Meta tag content not found");
    }
    emit("update:content", metaTagContent);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <form
    @submit.prevent="submit"
    class="grid grid-cols-8 my-4 mx-auto max-w-2xl w-full gap-x-4 gap-y-2"
  >
    <label for="link" class="col-span-full">Enter Instagram Url</label>
    <Input
      id="link"
      v-model="form.link"
      placeholder="https://www.instagram.com/xxxx"
      class="lg:col-span-6 col-span-full"
    />

    <div class="lg:col-span-2 col-span-full">
      <Button variant="brand" :isLoading class="w-full">Submit</Button>
    </div>
  </form>
</template>
