<script setup lang="ts">
import { Button } from "./ui/button";
import { useClipboard } from "@vueuse/core";

const value = defineModel<string>("value");

const { copy, copied } = useClipboard();
</script>
<template>
  <div class="flex-1">
    <div
      v-if="value"
      class="bg-muted rounded-2xl py-6 relative whitespace-pre-line mx-auto px-4 max-w-2xl"
    >
      <Button class="absolute top-4 right-4" @click="copy(value)">
        {{ copied ? "Copied!" : "Copy" }}
      </Button>
      {{ value }}
    </div>
  </div>
</template>
