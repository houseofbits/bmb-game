<script setup lang="ts">
const emit = defineEmits(["create-configuration", "documentation"]);
</script>
<template>
  <v-layout class="overflow-visible" style="height: 30px">
    <v-bottom-navigation elevation="1">
      <v-btn value="recent" @click="emit('create-configuration')">
        NEW DEVICE
      </v-btn>

      <v-btn value="favorites" @click="emit('documentation')">
        DOCUMENTATION
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
