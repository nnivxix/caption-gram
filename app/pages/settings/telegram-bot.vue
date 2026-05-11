<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { toast } from "vue-sonner";

const storedChatId = useStorage("telegram-chat-id", "");
const chatId = ref(storedChatId.value);
const isLoading = ref(false);
const errorMessage = ref("");

const clearChatId = () => {
  chatId.value = "";
  storedChatId.value = "";
  errorMessage.value = "";
  toast.success("Chat ID cleared successfully");
};

const submit = async () => {
  if (!chatId.value) {
    toast.error("Please enter a Chat ID");
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch("/api/telegram/validate", {
      method: "POST",
      body: {
        chatId: chatId.value,
      },
    });

    if (response.success) {
      // Save to localStorage
      storedChatId.value = chatId.value;
      toast.success(
        "Chat ID validated and saved successfully! Check your Telegram for confirmation.",
      );
    }
  } catch (error: any) {
    console.error("Failed to validate Telegram Chat ID:", error);
    const errorMsg =
      error?.data?.message ||
      "Failed to validate Chat ID. Please check and try again.";
    errorMessage.value = errorMsg;
    toast.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in storedChatId
watch(storedChatId, (newValue) => {
  chatId.value = newValue;
});

// Clear error when user starts typing
watch(chatId, () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
});
</script>
<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Telegram Bot Settings</h1>
    <p class="mb-4">
      To receive captions directly in Telegram, please enter your Telegram Chat
      ID below. You can find your Chat ID by
      <NuxtLink
        class="underline text-blue-500"
        to="https://t.me/caption_gram_bot"
        :external="true"
        target="_blank"
        >messaging the bot</NuxtLink
      >
      and then checking the console logs of your bot server.
    </p>
    <form class="space-y-2" @submit.prevent="submit">
      <Input
        v-model="chatId"
        type="text"
        placeholder="Enter your Telegram Chat ID"
        :disabled="isLoading"
      />
      <Button type="submit" :disabled="isLoading || !chatId">
        {{ isLoading ? "Validating..." : "Validate and Save" }}
      </Button>
    </form>
    <p class="text-sm text-muted-foreground">
      Your Chat ID will be saved locally in your browser and used to send
      captions to your Telegram account.
    </p>
    <p v-if="storedChatId" class="text-sm text-green-600 mt-2">
      ✓ Chat ID saved: {{ storedChatId }}
    </p>
    <p v-if="errorMessage" class="text-sm text-red-600 mt-2">
      ✗ {{ errorMessage }}
    </p>
    <button
      @click="clearChatId"
      class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Clear Chat ID
    </button>
  </div>
</template>
