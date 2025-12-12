<script setup lang="ts">
import { toast } from "vue-sonner";

const emit = defineEmits<{
  "update:content": [value: string];
}>();

const postId = ref("");
const isLoading = ref(false);
const url = ref("");

const submit = async () => {
  isLoading.value = true;

  try {
    await validateUrl(url.value);

    const response = await $fetch<{
      caption: string;
    }>("/api/ig", {
      method: "POST",
      body: { url: url.value },
    });
    emit("update:content", response.data.caption);
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

const validateUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("URL is required"));
      return;
    }

    const extractedId = extractPostId(url);

    if (extractedId === postId.value) {
      reject(new Error("You have submit this link"));
      return;
    }

    if (!extractedId) {
      reject(new Error("Invalid URL format"));
      return;
    }

    postId.value = extractedId;
    resolve(extractedId);
  });
};

const extractPostId = (url: string): string | null => {
  // Instagram: /p/{post_id}/ or /reel/{post_id}/
  const igMatch = url.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/);
  if (igMatch) return igMatch[2];

  // YouTube shorts: /shorts/{video_id}
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/);
  if (ytShortsMatch) return ytShortsMatch[1];

  // YouTube watch: ?v={video_id}
  const ytWatchMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (ytWatchMatch) return ytWatchMatch[1];

  // YouTube short link: youtu.be/{video_id}
  const ytShortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (ytShortMatch) return ytShortMatch[1];

  return null;
};
</script>
<template>
  <form
    @submit.prevent="submit"
    class="grid grid-cols-8 my-4 mx-auto max-w-2xl w-full gap-x-4 gap-y-2"
  >
    <label for="url" class="col-span-full">Enter Instagram & YouTube Url</label>
    <Input id="url" v-model="url" class="lg:col-span-6 col-span-full" />

    <div class="lg:col-span-2 col-span-full">
      <Button variant="brand" :isLoading class="w-full">Submit</Button>
    </div>
  </form>
</template>
