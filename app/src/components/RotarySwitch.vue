<script setup lang="ts">
import Label from "@src/components/Label.vue";
import Frame from "@src/components/Frame.vue";
import { computed, ref } from "vue";
import Line from "@src/components/Line.vue";

const emit = defineEmits(["change"]);
const props = defineProps({
  top: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    default: null,
  },
  values: {
    type: Array<{ value: string; name: string }>,
    required: true,
  },
});

const selectedValue = ref(0);

const modeClass = computed(() => {
  return "position-" + selectedValue.value;
});

function computeLine(angleRadians: number): Array<Array<number>> {
  const x = Math.cos(angleRadians);
  const y = Math.sin(angleRadians);
  const center = 53;
  const len = 55 + 10;
  return [
    [center + x * 55, center + y * 55],
    [center + x * len, center + y * len],
  ];
}

const line1Points = computed(() => computeLine(Math.PI / 4));
const line2Points = computed(() => computeLine((3 * Math.PI) / 4));
const line3Points = computed(() => computeLine((5 * Math.PI) / 4));
const line4Points = computed(() => computeLine((7 * Math.PI) / 4));

function toggleMode(): void {
  selectedValue.value = (selectedValue.value + 1) % 4;
  emit("change", props.values[selectedValue.value].value);
}
</script>
<template>
  <Frame
    radius="50%"
    :left="props.left + 'px'"
    :top="props.top + 'px'"
    height="110px"
    width="110px"
    :text="props.text"
  >
    <div
      class="rotary-switch four-way"
      @click="toggleMode"
      :class="[modeClass]"
    >
      <div class="rotary-switch-body">
        <div class="rotary-switch-top">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
          >
            <path
              d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z"
            />
          </svg>
        </div>
      </div>
    </div>

    <Line :points="line1Points" />
    <Line :points="line2Points" />
    <Line :points="line3Points" />
    <Line :points="line4Points" />

    <Label top="-5px" left="110px">{{ props.values[0].value }}</Label>
    <Label top="-5px" left="-25px">{{ props.values[3].value }}</Label>
    <Label top="90px" left="-25px">{{ props.values[2].value }}</Label>
    <Label top="90px" left="110px">{{ props.values[1].value }}</Label>
  </Frame>
</template>
