<script setup lang="ts">
import "@style/modules/wire-matcher.scss";
import ModuleStatusIndicator from "@src/components/ModuleStatusIndicator.vue";
import { onMounted, ref } from "vue";
import WireJack from "@src/modules/WireMatcher/components/WireJack.vue";
import defineModuleState, {
  ModuleEmits,
  ModuleProps,
} from "@src/composables/defineModuleState";
import PortPin from "@src/modules/WireMatcher/structures/PortPin";
import { logContainerMousePosition } from "@src/helpers/debugging";

const emit = defineEmits(ModuleEmits);
const props = defineProps(ModuleProps);
const state = defineModuleState(props, emit);

state.onArmed(armModule);
state.onReady(restartModule);
state.onFailed(freezeModule);

const canvasElement = ref(null);
const contentElement = ref(null);
const startingPoint = ref<Array<number> | null>(null);
let selectedPortPin: PortPin;
const elementOffset = 18;
let mousePosition: Array<number> = [0, 0];
let segmentsToDraw: Array<Array<number>> = [];
let connectedPortPins: Array<Array<PortPin>> = [];

const colorClasses = ["red", "green", "blue", "yellow"];
const portColors: Array<Array<number | null>> = [
  [null, null, null, null, null],
  [null, null, null, null, null],
];

function armModule(): void {
  segmentsToDraw = [];
  connectedPortPins = [];
  generateColors();
  renderWires();
}

function restartModule(): void {
  segmentsToDraw = [];
  connectedPortPins = [];
  clearColors();
  renderWires();
}

function freezeModule(): void {}

function selectInput(event: PointerEvent, port: number, pin: number) {
  if (!contentElement.value || !state.isArmed.value) {
    return;
  }
  const portPin = new PortPin(port, pin);
  const element = <HTMLElement>event.target;
  const rect = element.getBoundingClientRect();
  const contentRect = (<HTMLElement>(
    contentElement.value
  )).getBoundingClientRect();

  if (
    isPinOccupied(portPin) ||
    (startingPoint.value && selectedPortPin.isEqual(portPin))
  ) {
    return;
  }

  if (startingPoint.value === null) {
    startingPoint.value = [rect.x - contentRect.x, rect.y - contentRect.y];
    selectedPortPin = portPin;
  } else {
    const endingPoint = [rect.x - contentRect.x, rect.y - contentRect.y];
    segmentsToDraw.push([
      startingPoint.value[0] + elementOffset,
      startingPoint.value[1] + elementOffset,
      endingPoint[0] + elementOffset,
      endingPoint[1] + elementOffset,
    ]);

    connectedPortPins.push([selectedPortPin, portPin]);

    startingPoint.value = null;

    renderWires();

    validateConnections();
  }
}

function isPinOccupied(portPin: PortPin): boolean {
  for (const portPinElement of connectedPortPins) {
    if (
      portPin.isEqual(portPinElement[0]) ||
      portPin.isEqual(portPinElement[1])
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Basic rules to match colors from port A to port B
 */
function validateConnections(): void {
  const portColorsCopy = [[...portColors[0]], [...portColors[1]]];

  //Validate existing connections
  for (const connection of connectedPortPins) {
    const color0 =
      portColorsCopy[connection[0].portIndex][connection[0].pinIndex];
    const color1 =
      portColorsCopy[connection[1].portIndex][connection[1].pinIndex];

    if (color0 !== color1) {
      state.emitFailed();
    }

    portColorsCopy[connection[0].portIndex][connection[0].pinIndex] = null;
    portColorsCopy[connection[1].portIndex][connection[1].pinIndex] = null;
  }

  //Check if it is possible to make any more connections from port A to port B
  for (const color0 of portColorsCopy[0]) {
    if (color0 !== null && portColorsCopy[1].find((val) => color0 === val)) {
      return;
    }
  }

  for (const color1 of portColorsCopy[1]) {
    if (color1 !== null && portColorsCopy[0].find((val) => color1 === val)) {
      return;
    }
  }

  state.emitDisarmed();
}

function drawWire(ctx: CanvasRenderingContext2D, points: Array<number>): void {
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#6c6c6c";
  ctx.lineCap = "round";
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 7;
  ctx.shadowColor = "#3d3d3d";

  const cpOffset = 50;
  const cp1 = [
    points[0],
    points[1] > 130 ? points[1] - cpOffset : points[1] + cpOffset,
  ];
  const cp2 = [
    points[2],
    points[3] > 130 ? points[3] - cpOffset : points[3] + cpOffset,
  ];

  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], points[2], points[3]);
  ctx.stroke();
}

function handleMuseMove(event: MouseEvent): void {
  if (contentElement.value && state.isArmed.value) {
    const contentRect = (<HTMLElement>(
      contentElement.value
    )).getBoundingClientRect();
    mousePosition = [event.x - contentRect.x, event.y - contentRect.y];

    renderWires();
  }
}

function renderWires(): void {
  if (!canvasElement.value) {
    return;
  }

  const canvas = <HTMLCanvasElement>canvasElement.value; //document.getElementById("wire-canvas");
  if (canvas) {
    const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const segment of segmentsToDraw) {
      drawWire(ctx, segment);
    }

    if (startingPoint.value !== null) {
      const mSegment = [
        startingPoint.value[0] + elementOffset,
        startingPoint.value[1] + elementOffset,
        mousePosition[0],
        mousePosition[1],
      ];

      drawWire(ctx, mSegment);
    }
  }
}

function getColor(port: number, index: number): string {
  const colorIndex = portColors[port][index];
  if (colorIndex !== null) {
    return colorClasses[colorIndex];
  }
  return "";
}

function generateColors(): void {
  for (let i = 0; i < portColors[0].length; i++) {
    portColors[0][i] = Math.floor(Math.random() * 4);
  }

  for (let i = 0; i < portColors[1].length; i++) {
    portColors[1][i] = Math.floor(Math.random() * 4);
  }
}

function clearColors(): void {
  for (let i = 0; i < portColors[0].length; i++) {
    portColors[0][i] = null;
  }

  for (let i = 0; i < portColors[1].length; i++) {
    portColors[1][i] = null;
  }
}

function isSelected(port: number, pin: number): boolean {
  if (startingPoint.value !== null) {
    return selectedPortPin.isEqual(new PortPin(port, pin));
  }
  return false;
}

onMounted(() => {
  if (contentElement.value) {
    (<HTMLElement>contentElement.value).addEventListener(
      "mousemove",
      handleMuseMove,
    );
  }
});
</script>
<template>
  <div class="module card-module">
    <div
      class="content"
      ref="contentElement"
      @mousemove="logContainerMousePosition"
    >
      <div class="row-of-inputs row-1">
        <WireJack
          v-for="(n, index) in 5"
          :key="index"
          :is-selected="isSelected(0, index)"
          :color="getColor(0, index)"
          orientation="down"
          @select="(e: PointerEvent) => selectInput(e, 0, index)"
        />
      </div>

      <svg
        class="signal-icon"
        xmlns="http://www.w3.org/2000/svg"
        height="2em"
        viewBox="0 0 512 512"
      >
        <path
          d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"
        />
      </svg>

      <div class="row-of-inputs row-2">
        <WireJack
          v-for="(n, index) in 5"
          :key="index"
          :is-selected="isSelected(1, index)"
          :color="getColor(1, index)"
          orientation="up"
          @select="(e: PointerEvent) => selectInput(e, 1, index)"
        />
      </div>

      <canvas
        width="400"
        height="300"
        class="wire-canvas"
        ref="canvasElement"
      />

      <div class="label port-a-label">PORT A</div>
      <div class="label port-b-label">PORT B</div>
    </div>
    <ModuleStatusIndicator
      :is-armed="state.isArmed.value"
      :is-disarmed="state.isDisarmed.value"
    />
  </div>
</template>
