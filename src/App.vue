<script setup lang="ts">
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
</script>
<template>
  <div>
    <form class="grid grid-cols-8 my-4 mx-auto max-w-2xl gap-4">
      <Input class="col-span-7" />

      <div class="col-span-1">
        <Button>Submit</Button>
      </div>
    </form>
  </div>
</template>
