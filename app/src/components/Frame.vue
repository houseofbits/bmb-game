<script setup lang="ts">
import { computed, onMounted, ref, VNode } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: null,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  top: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    required: true,
  },
  radius: {
    type: String,
    default: "0",
  },
  hasBorder: {
    type: Boolean,
    default: true,
  },
});

const textLabelNode = ref<HTMLElement | null>(null);

const frameStyle = computed(() => {
  return {
    top: props.top + "px",
    left: props.left + "px",
    width: props.width + "px",
    height: props.height + "px",
  };
});

const borderStyle = computed(() => {
  let clipPath = null;
  if (textLabelNode.value) {
    const halfLabelWidth = textLabelNode.value.offsetWidth / 2;
    const halfLabelHeight = textLabelNode.value.offsetHeight / 2;
    const p1x = props.width / 2 + halfLabelWidth;
    const p2y = props.height - 2;
    const p3x = props.width / 2 - halfLabelWidth;

    let dent = p1x + "px 100%, ";
    dent += p1x + "px " + p2y + "px, ";
    dent += "50% 50%, ";
    dent += p3x + "px " + p2y + "px, ";
    dent += p3x + "px 100%";

    clipPath = "polygon(0% 0%,100% 0%,100% 100%, " + dent + ", 0% 100%)";
  }

  return {
    "border-radius": props.radius,
    "clip-path": clipPath,
  };
});
</script>
<template>
  <div class="framed-label" :style="frameStyle">
    <slot />
    <div v-if="hasBorder" class="with-border" :style="borderStyle" />
    <div v-if="props.text" class="label-wrapper">
      <div class="label" ref="textLabelNode">
        {{ text }}
      </div>
    </div>
  </div>
</template>
