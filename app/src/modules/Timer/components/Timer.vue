<script setup lang="ts">
import SevenSegment from "@src/components/SevenSegment.vue";
import { computed, reactive, ref } from "vue";
const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  },
});

const digitWidth = 50;
const digitHeight = 80;

// const characters = ref<Array<string>>(["0", "0", "0", "0"]);

function getFormattedTime(): string {
  const minutes = props.seconds / 60;
  const fullMinutes = Math.floor(minutes);
  const leftoverSeconds = Math.floor((minutes - fullMinutes) * 60);
  const secondsString = ("00" + leftoverSeconds).slice(-2);

  if (fullMinutes >= 1) {
    const minutesString = ("00" + fullMinutes).slice(-2);

    const minStrArray = minutesString.split("");
    const secStrArray = secondsString.split("");

    characters.value[0] = minStrArray[0];
    characters.value[1] = minStrArray[1];
    characters.value[2] = secStrArray[0];
    characters.value[3] = secStrArray[1];

    // console.log(characters.value);
  }

  const leftoverSecondFractions = props.seconds - leftoverSeconds;
  const milisecondsString = leftoverSecondFractions.toFixed(2).slice(-2);

  return secondsString + " . " + milisecondsString;
}

const characters = computed(() => {
  const minutes = props.seconds / 60;
  const fullMinutes = Math.floor(minutes);
  const leftoverSeconds = Math.floor((minutes - fullMinutes) * 60);
  const secondsString = ("00" + leftoverSeconds).slice(-2);

  if (fullMinutes >= 1) {
    const minutesString = ("00" + fullMinutes).slice(-2);

    const minStrArray = minutesString.split("");
    const secStrArray = secondsString.split("");

    return [minStrArray[0], minStrArray[1], secStrArray[0], secStrArray[1]];
  }

  const leftoverSecondFractions = props.seconds - leftoverSeconds;
  const milisecondsString = leftoverSecondFractions.toFixed(2).slice(-2);

  const secStrArray = secondsString.split("");
  const msStrArray = milisecondsString.split("");

  return [secStrArray[0], secStrArray[1], msStrArray[0], msStrArray[1]];
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
