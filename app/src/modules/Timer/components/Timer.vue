<script setup lang="ts">
import SevenSegment from "@src/components/SevenSegment.vue";
import { computed, reactive, ref, watch } from "vue";
import { getFormattedTime } from "@src/helpers/timer";

const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    default: 80,
  },
  segmentSize: {
    type: Number,
    default: 7,
  },
  top: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    required: true,
  },
  gap: {
    type: Number,
    default: 8,
  },
});

const digitWidth = props.height * 0.625;
const digitHeight = props.height;

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
        p2Active.value = p1Active.value;
      }
      prevValue = intVal;
    }
  },
);

const wrapperStyle = computed(() => {
  return {
    top: props.top + "px",
    left: props.left + "px",
    gap: props.gap + "px",
  };
});

const dividerStyle = computed(() => {
  return {
    height: props.height + "px",
  };
});

const diodeStyle = computed(() => {
  return {
    width: props.segmentSize * 2 + "px",
    height: props.segmentSize * 2 + "px",
  };
});

const characters = computed(() => {
  return getFormattedTime(props.seconds).split("");
});
</script>
<template>
  <div class="seven-segment-timer" :style="wrapperStyle">
    <SevenSegment
      class="digit"
      :segment-size="segmentSize"
      :padding="segmentSize"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[0]"
    />
    <SevenSegment
      class="digit"
      :segment-size="segmentSize"
      :padding="segmentSize"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[1]"
    />
    <div class="divider" :style="dividerStyle">
      <div class="diode" :style="diodeStyle" :class="{ active: p1Active }" />
      <div class="diode" :style="diodeStyle" :class="{ active: p2Active }" />
    </div>
    <SevenSegment
      class="digit"
      :segment-size="segmentSize"
      :padding="segmentSize"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[2]"
    />
    <SevenSegment
      class="digit"
      :segment-size="segmentSize"
      :padding="segmentSize"
      :height="digitHeight"
      :width="digitWidth"
      :character="characters[3]"
    />
  </div>
</template>
