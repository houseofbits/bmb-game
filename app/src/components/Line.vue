<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  points: {
    type: Array<Array<number>>,
    required: true,
  },
});

const canvas = ref<HTMLCanvasElement | null>(null);

const minX = computed(() => {
  let min: number = 9999;
  for (const point of props.points) {
    if (point[0] < min) {
      min = point[0];
    }
  }

  return min;
});

const minY = computed(() => {
  let min: number = 9999;
  for (const point of props.points) {
    if (point[1] < min) {
      min = point[1];
    }
  }

  return min;
});

const width = computed(() => {
  let min = 9999;
  let max = 0;
  for (const point of props.points) {
    if (point[0] > max) {
      max = point[0];
    }
    if (point[0] < min) {
      min = point[0];
    }
  }

  if (max < min) {
    return 500;
  }

  return max - min + 20;
});

const height = computed(() => {
  let min = 9999;
  let max = 0;
  for (const point of props.points) {
    if (point[1] > max) {
      max = point[1];
    }
    if (point[1] < min) {
      min = point[1];
    }
  }

  if (max < min) {
    return 500;
  }

  return max - min + 20;
});

const style = computed(() => {
  return {
    top: minY.value - 10 + "px",
    left: minX.value - 10 + "px",
  };
});

onMounted(() => {
  const canvasElement = <HTMLCanvasElement>canvas.value;
  const ctx = <CanvasRenderingContext2D>canvasElement.getContext("2d");
  if (ctx && props.points?.length > 0) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(
      props.points[0][0] - minX.value + 10,
      props.points[0][1] - minY.value + 10,
    );
    for (let i = 1; i < props.points?.length; i++) {
      ctx.lineTo(
        props.points[i][0] - minX.value + 10,
        props.points[i][1] - minY.value + 10,
      );
      ctx.stroke();
    }
  }
});
</script>
<template>
  <canvas
    :width="width"
    :height="height"
    ref="canvas"
    class="technical-line"
    :style="style"
  />
</template>
