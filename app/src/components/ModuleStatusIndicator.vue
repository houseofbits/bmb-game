<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const STRIKE_BLINK_INTERVALS: { [index: number]: number } = {
  1: 400,
  2: 200,
};

const props = defineProps({
  isArmed: {
    type: Boolean,
    required: true,
  },
  isDisarmed: {
    type: Boolean,
    required: true,
  },
  strikeNumber: {
    type: Number,
    default: () => 0,
  },
});

const isArmedLocal = ref(false);
let blinkTimerId: number;

watch(
  () => props.isArmed,
  (value: boolean) => {
    if (!value) {
      clearInterval(blinkTimerId);
    }
    isArmedLocal.value = value;
  },
);

watch(
  () => props.strikeNumber,
  (number: number) => {
    if (number > 0) {
      startBlinkInterval(STRIKE_BLINK_INTERVALS[number]);
    }
  },
);

function startBlinkInterval(interval: number): void {
  clearInterval(blinkTimerId);
  blinkTimerId = <number>(<unknown>setInterval(() => {
    if (props.isArmed) {
      isArmedLocal.value = !isArmedLocal.value;
    }
  }, interval));
}
</script>
<template>
  <div class="module-status-indicator">
    <div class="led armed" :class="{ active: isArmedLocal }">
      <div class="label">ARMED</div>
    </div>
    <div class="led disarmed" :class="{ active: isDisarmed }">
      <div class="label">DISARMED</div>
    </div>
  </div>
</template>
