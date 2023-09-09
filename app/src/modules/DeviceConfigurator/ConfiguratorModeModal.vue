<script setup lang="ts">
import { ref } from "vue";
import devicePresets from "@src/config/devicePresets";

const emit = defineEmits(["apply", "close", "select-custom"]);

const isModalVisible = ref(true);
const selectedPreset = ref<string>();

const presets: Array<string> = devicePresets.map((preset) => {
  return preset.name;
});

function apply(): void {
  // console.log(devicePresets);
  const index = devicePresets.findIndex((preset) => {
    return preset.name === selectedPreset.value;
  });

  if (index !== undefined) {
    emit(
      "apply",
      devicePresets[index].width,
      devicePresets[index].height,
      devicePresets[index].modules,
    );
  }
}
</script>
<template>
  <v-dialog v-model="isModalVisible" width="auto" persistent>
    <v-card>
      <v-card-title>New device</v-card-title>
      <v-card-subtitle
        >How would You like to build your new device?
      </v-card-subtitle>

      <v-container class="mt-4">
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn size="x-large">RANDOM</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn size="x-large" @click="emit('select-custom')">CUSTOM</v-btn>
          </v-col>
        </v-row>
        <v-row class="py-4" align="center" justify="center">
          <v-card-subtitle class="justify-center"
            >or from a preset
          </v-card-subtitle>
        </v-row>
        <v-row align="center" justify="center">
          <v-col>
            <VSelect
              v-model="selectedPreset"
              class="ma-3"
              label="DEVICE PRESETS"
              variant="outlined"
              :items="presets"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn color="secondary" @click="emit('close')">Close</v-btn>
        <v-btn color="primary" :disabled="!selectedPreset" @click="apply"
          >BUILD
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
