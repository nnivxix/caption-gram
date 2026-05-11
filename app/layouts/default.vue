<script setup lang="ts"></script>
<template>
  <div id="layout" class="flex flex-col min-h-[95vh] px-4">
    <Header />
    <section class="my-4 mx-auto max-w-2xl w-full flex-1">
      <slot />
    </section>
    <Footer />
  </div>
</template>
