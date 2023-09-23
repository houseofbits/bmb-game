<script setup lang="ts">
import SevenSegment from "@src/components/SevenSegment.vue";
import { computed, reactive, ref, watch } from "vue";
import { getFormattedTime } from "@src/helpers/timer";
const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  },
});

const digitWidth = 50;
const digitHeight = 80;

const p1Active = ref(false);
const p2Active = ref(false);

let prevValue = 0;

watch(
  () => props.seconds,
  (value) => {
    const intVal = Math.floor(value);
    if (intVal != prevValue) {
      if (intVal < 60) {
        p1Active.value = false;
        p2Active.value = !p2Active.value;
      } else {
        p1Active.value = !p1Active.value;
        p2Active.value = !p2Active.value;
      }
      prevValue = intVal;
    }
  },
);

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

    <div class="diode p1" :class="{ active: p1Active }" />
    <div class="diode p2" :class="{ active: p2Active }" />
  </div>
</template>
