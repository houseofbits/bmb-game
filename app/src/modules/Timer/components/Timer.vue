<script setup lang="ts">
import SevenSegment from "@src/components/SevenSegment.vue";
import { computed, reactive, ref } from "vue";
import { getFormattedTime } from "@src/helpers/timer";
const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  },
});

const digitWidth = 50;
const digitHeight = 80;

const characters = computed(() => {
  return getFormattedTime(props.seconds).split("");
});
</script>
<template>
  <div class="seven-segment-timer">
    <SevenSegment
      class="digit"
      :segment-size="7"
      :padding="7"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[0]"
    />
    <SevenSegment
      class="digit"
      :segment-size="7"
      :padding="7"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[1]"
    />
    <div class="divider"></div>
    <SevenSegment
      class="digit"
      :segment-size="7"
      :padding="7"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[2]"
    />
    <SevenSegment
      class="digit"
      :segment-size="7"
      :padding="7"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[3]"
    />
  </div>
</template>
