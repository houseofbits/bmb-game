<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  padding: {
    type: Number,
    required: true,
  },
  segmentSize: {
    type: Number,
    required: true,
  },
  character: {
    type: String,
    default: null,
  },
});

const width = ref(70);
const height = ref(120);
const padding = ref(10);
let segments = generateSegments(
  width.value - padding.value * 2,
  height.value - padding.value * 2,
  10,
  2,
);
let styleA = createClipPathStyle(segments.pointsA);
let styleB = createClipPathStyle(segments.pointsB);
let styleC = createClipPathStyle(segments.pointsC);
let styleD = createClipPathStyle(segments.pointsD);
let styleE = createClipPathStyle(segments.pointsE);
let styleF = createClipPathStyle(segments.pointsF);
let styleG = createClipPathStyle(segments.pointsG);

const activeState = computed(() => {
  switch (props.character) {
    case "0":
      return [1, 1, 1, 1, 1, 1, 0];
    case "1":
      return [0, 1, 1, 0, 0, 0, 0];
    case "2":
      return [1, 1, 0, 1, 1, 0, 1];
    case "3":
      return [1, 1, 1, 1, 0, 0, 1];
    case "4":
      return [0, 1, 1, 0, 0, 1, 1];
    case "5":
      return [1, 0, 1, 1, 0, 1, 1];
    case "6":
      return [1, 0, 1, 1, 1, 1, 1];
    case "7":
      return [1, 1, 1, 0, 0, 0, 0];
    case "8":
      return [1, 1, 1, 1, 1, 1, 1];
    case "9":
      return [1, 1, 1, 1, 0, 1, 1];
    case "-":
      return [0, 0, 0, 0, 0, 0, 1];
    case "_":
      return [0, 0, 0, 1, 0, 0, 0];
    case "c":
      return [0, 0, 0, 1, 1, 0, 1];
  }

  return [0, 0, 0, 0, 0, 0, 0];
});

const bodyStyle = computed(() => {
  return {
    width: width.value + "px",
    height: height.value + "px",
  };
});

const segmentsStyle = computed(() => {
  return {
    width: width.value - padding.value * 2 + "px",
    height: height.value - padding.value * 2 + "px",
    top: padding.value + "px",
    left: padding.value + "px",
  };
});

onMounted(() => {
  width.value = props.width;
  height.value = props.height;
  padding.value = props.padding;

  segments = generateSegments(
    width.value - padding.value * 2,
    height.value - padding.value * 2,
    props.segmentSize,
    props.segmentSize / 4,
  );
  styleA = createClipPathStyle(segments.pointsA);
  styleB = createClipPathStyle(segments.pointsB);
  styleC = createClipPathStyle(segments.pointsC);
  styleD = createClipPathStyle(segments.pointsD);
  styleE = createClipPathStyle(segments.pointsE);
  styleF = createClipPathStyle(segments.pointsF);
  styleG = createClipPathStyle(segments.pointsG);
});

function createClipPathStyle(polygonPoints: Array<Array<number>>): object {
  const units = "px";
  const points2 = polygonPoints.map(
    (value: Array<number>) => value[0] + units + " " + value[1] + units,
  );

  return {
    "clip-path": "polygon(" + points2.join(", ") + ")",
  };
}

function generateSegments(
  width: number,
  height: number,
  segmentWidth: number,
  margin: number,
) {
  const halfSWidth = segmentWidth / 2;
  const halfMarginSin = (margin / 2) * 0.707;
  const halfMarginCos = (margin / 2) * 1.414;
  const halfHeight = height * 0.5;

  //A
  const pointsA: Array<Array<number>> = [];
  pointsA.push([segmentWidth, 0]);
  pointsA.push([width - segmentWidth, 0]);
  pointsA.push([
    width - halfSWidth - halfMarginSin,
    halfSWidth - halfMarginSin,
  ]);
  pointsA.push([width - segmentWidth - halfMarginCos, segmentWidth]);
  pointsA.push([segmentWidth + halfMarginCos, segmentWidth]);
  pointsA.push([halfSWidth + halfMarginSin, halfSWidth - halfMarginSin]);

  //D
  const pointsD: Array<Array<number>> = [];
  pointsD.push([segmentWidth + halfMarginCos, height - segmentWidth]);
  pointsD.push([width - segmentWidth - halfMarginCos, height - segmentWidth]);
  pointsD.push([
    width - halfSWidth - halfMarginSin,
    height - halfSWidth + halfMarginSin,
  ]);
  pointsD.push([width - segmentWidth, height]);
  pointsD.push([segmentWidth, height]);
  pointsD.push([
    halfSWidth + halfMarginSin,
    height - halfSWidth + halfMarginSin,
  ]);

  //F
  const pointsF: Array<Array<number>> = [];
  pointsF.push([0, segmentWidth]);
  pointsF.push([halfSWidth - halfMarginSin, halfSWidth + halfMarginSin]);
  pointsF.push([segmentWidth, segmentWidth + halfMarginCos]);
  pointsF.push([segmentWidth, halfHeight - halfSWidth - halfMarginCos]);
  pointsF.push([halfSWidth - halfMarginSin, halfHeight - halfMarginSin]);
  pointsF.push([0, halfHeight - halfSWidth]);

  //B
  const pointsB: Array<Array<number>> = [];
  pointsB.push([width - segmentWidth, segmentWidth + halfMarginCos]);
  pointsB.push([
    width - (halfSWidth - halfMarginSin),
    halfSWidth + halfMarginSin,
  ]);
  pointsB.push([width, segmentWidth]);
  pointsB.push([width, halfHeight - halfSWidth]);
  pointsB.push([
    width - (halfSWidth - halfMarginSin),
    halfHeight - halfMarginSin,
  ]);
  pointsB.push([width - segmentWidth, halfHeight - halfSWidth - halfMarginCos]);

  //C
  const pointsC: Array<Array<number>> = [];
  pointsC.push([width - segmentWidth, halfHeight + halfSWidth + halfMarginCos]);
  pointsC.push([
    width - (halfSWidth - halfMarginSin),
    halfHeight + halfMarginSin,
  ]);
  pointsC.push([width, halfHeight + halfSWidth]);
  pointsC.push([width, height - segmentWidth]);
  pointsC.push([
    width - (halfSWidth - halfMarginSin),
    height - halfSWidth - halfMarginSin,
  ]);
  pointsC.push([width - segmentWidth, height - segmentWidth - halfMarginCos]);

  //E
  const pointsE: Array<Array<number>> = [];
  pointsE.push([0, halfHeight + halfSWidth]);
  pointsE.push([halfSWidth - halfMarginSin, halfHeight + halfMarginSin]);
  pointsE.push([segmentWidth, halfHeight + halfSWidth + halfMarginCos]);
  pointsE.push([segmentWidth, height - segmentWidth - halfMarginCos]);
  pointsE.push([
    halfSWidth - halfMarginSin,
    height - halfSWidth - halfMarginSin,
  ]);
  pointsE.push([0, height - segmentWidth]);

  //G
  const pointsG: Array<Array<number>> = [];
  pointsG.push([segmentWidth + halfMarginCos, halfHeight - halfSWidth]);
  pointsG.push([width - segmentWidth - halfMarginCos, halfHeight - halfSWidth]);
  pointsG.push([width - halfSWidth - halfMarginCos, halfHeight]);
  pointsG.push([width - segmentWidth - halfMarginCos, halfHeight + halfSWidth]);
  pointsG.push([segmentWidth + halfMarginCos, halfHeight + halfSWidth]);
  pointsG.push([halfSWidth + halfMarginCos, halfHeight]);

  return {
    pointsA,
    pointsB,
    pointsC,
    pointsD,
    pointsE,
    pointsF,
    pointsG,
  };
}
</script>
<template>
  <div class="seven-segment-body" :style="bodyStyle">
    <div class="seven-segment" :style="segmentsStyle">
      <div class="glow-wrapper" :class="{ active: activeState[0] }">
        <div class="segment" :style="styleA" />
      </div>
      <div class="glow-wrapper" :class="{ active: activeState[1] }">
        <div class="segment" :style="styleB" />
      </div>
      <div class="glow-wrapper" :class="{ active: activeState[2] }">
        <div class="segment" :style="styleC" />
      </div>
      <div class="glow-wrapper" :class="{ active: activeState[3] }">
        <div class="segment" :style="styleD" />
      </div>
      <div class="glow-wrapper" :class="{ active: activeState[4] }">
        <div class="segment" :style="styleE" />
      </div>
      <div class="glow-wrapper" :class="{ active: activeState[5] }">
        <div class="segment" :style="styleF" />
      </div>
      <div class="glow-wrapper" :class="{ active: activeState[6] }">
        <div class="segment" :style="styleG" />
      </div>
    </div>
  </div>
</template>
