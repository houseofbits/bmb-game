<script setup lang="ts">
import { ref } from "vue";
import defineDebugState from "@src/composables/defineDebugState";

const debugState = defineDebugState();
const packageVersion = require("/package.json").version;

const emit = defineEmits(["close", "select"]);
const isModalVisible = ref(true);

function close(): void {
  emit("close");
}
</script>
<template>
  <v-dialog v-model="isModalVisible" width="auto" persistent>
    <v-card>
      <v-card-title> BMB Game v{{ packageVersion }}</v-card-title>
      <v-card-text>
        <v-switch
          v-model="debugState.isDebugModeEnabled.value"
          hide-details
          label="Debug mode"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
