<script setup lang="ts">
import { toast } from "vue-sonner";
import { useStorage } from "@vueuse/core";
import { useSubmit } from "~/composables/useSubmit";

const emit = defineEmits<{
  "update:content": [value: string];
}>();

type IgResponse = {
  success: boolean;
  data: {
    caption: string;
    telegramSent: boolean;
  };
};

const url = ref("");
const chatId = useStorage("telegram-chat-id", "");
const {
  public: { captionApiUrl },
} = useRuntimeConfig();

const { submit, isLoading } = useSubmit(
  () =>
    $fetch<IgResponse>(`${captionApiUrl}/api/ig`, {
      method: "POST",
      body: JSON.stringify({ url: url.value, chatId: chatId.value }),
    }),
  {
    onError(error) {
      toast.error(error.message || "An error occurred while fetching captions");
    },
    onSuccess(data) {
      emit("update:content", data.data.caption);
      toast.success("Captions fetched successfully!");
      url.value = "";
    },
  },
);
</script>
<template>
  <form @submit.prevent="submit" class="grid grid-cols-8 gap-x-4 gap-y-3">
    <label for="url" class="col-span-full"
      >Enter Instagram, YouTube, or Facebook URL</label
    >
    <Input
      id="url"
      required
      v-model="url"
      class="lg:col-span-6 col-span-full"
    />

    <div class="lg:col-span-2 col-span-full">
      <Button variant="brand" :isLoading="isLoading" class="w-full"
        >Submit</Button
      >
    </div>

    <p class="col-span-full border-t py-2 text-sm text-muted-foreground">
      <strong>New feature:</strong> You can now receive captions directly in
      Telegram! Just enter your Telegram Chat ID below, and we'll send the
      captions straight to your Telegram account. Set it up in the
      <NuxtLink to="/settings/telegram-bot" class="text-blue-500 underline"
        >Telegram Bot Settings</NuxtLink
      >
      page.
    </p>
  </form>
</template>
