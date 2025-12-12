<script setup lang="ts">
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ref } from "vue";
import { toast } from "vue-sonner";

const emit = defineEmits<{
  "update:content": [value: string];
}>();

const instagramPostId = ref("");

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
    const link = form.value.link;
    const postId = link.split("/p/")[1]?.split("/")[0];

    if (postId === instagramPostId.value) {
      return toast.error("You have already submitted this link");
    }
    instagramPostId.value = postId;

    const response = await $fetch<{
      caption: string;
    }>("/api/ig", {
      method: "POST",
      body: { url: link },
    });
    emit("update:content", response.data);
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
