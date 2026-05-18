<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { toast } from "vue-sonner";
import { XIcon } from "lucide-vue-next";

const storedChatId = useStorage("telegram-chat-id", "");
const chatId = ref(storedChatId.value);
const errorMessage = ref("");
const {
  public: { captionApiUrl },
} = useRuntimeConfig();

const clearChatId = () => {
  if (!chatId.value) return;

  chatId.value = "";
  storedChatId.value = "";
  errorMessage.value = "";
};

const { submit, isLoading, succeeded } = useSubmit(
  () =>
    $fetch(`${captionApiUrl}/api/telegram/validate`, {
      method: "POST",
      body: JSON.stringify({ chatId: chatId.value }),
    }),
  {
    onError(error) {
      errorMessage.value = error.data.message || "Failed to validate Chat ID";
      toast.error(error.data.message);
    },
    onSuccess() {
      storedChatId.value = chatId.value;
      errorMessage.value = "";
      toast.success("Chat ID validated and saved successfully!");
    },
  },
);
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
      >.
    </p>
    <form class="space-y-2" @submit.prevent="submit">
      <div class="relative">
        <Input
          v-model="chatId"
          type="text"
          placeholder="Enter your Telegram Chat ID"
          :disabled="isLoading"
          required
        />
        <ClientOnly>
          <XIcon
            class="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            @click="clearChatId"
            :class="{
              'text-muted-foreground/40': !chatId,
            }"
          />
        </ClientOnly>
      </div>
      <ClientOnly>
        <Button type="submit" :disabled="isLoading || !chatId">
          {{ isLoading ? "Validating..." : "Validate and Save" }}
        </Button>
      </ClientOnly>
    </form>
    <p class="text-sm text-muted-foreground">
      Your Chat ID will be saved locally in your browser and used to send
      captions to your Telegram account.
    </p>
    <p v-if="succeeded" class="text-sm text-green-600 mt-2">
      ✓ Chat ID saved successfully!
    </p>
    <p v-if="errorMessage" class="text-sm text-red-600 mt-2">
      ✗ {{ errorMessage }}
    </p>
  </div>
</template>
