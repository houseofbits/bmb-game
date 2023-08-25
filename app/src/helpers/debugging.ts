// @mousemove="logContainerMousePosition"
export function logContainerMousePosition(event: MouseEvent): void {
  const contentEl: HTMLElement = event.srcElement.closest(".content");

  const rect = contentEl.getBoundingClientRect();
  const contentX = rect.left + window.scrollX;
  const contentY = rect.top + window.scrollY;

  const x = event.x - contentX;
  const y = event.y - contentY;

  if (event.ctrlKey) {
    console.log(x.toFixed(0) + ", " + y.toFixed(0));
  }
}
