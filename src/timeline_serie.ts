import styles from "./styles.module.css";

export class TimelineSerie {
  #serie: HTMLDivElement;
  #label: HTMLDivElement;

  constructor(container: Element, start: number, end: number) {
    this.#serie = document.createElement("div");
    this.#serie.className = styles.serie;
    this.setStart(start);
    let duration = end - start;
    this.setDuration(duration);

    let label = document.createElement("div");
    label.className = styles.label;
    this.#label = label;
    this.updateLabel(start, duration);
    this.#serie.appendChild(label);

    this.addGuide(styles.left, this.resizeLeft);
    this.addGuide(styles.right, this.resizeRight);

    container.appendChild(this.#serie);
  }

  private addGuide(
    style: string,
    callback: (
      this: TimelineSerie,
      currentStart: number,
      initialStart: number,
      diff: number,
      currentDuration: number,
      initialDuration: number
    ) => void
  ) {
    let guideLeft = document.createElement("div");
    guideLeft.className = style;
    this.handleResize(guideLeft, callback);
    this.#serie.appendChild(guideLeft);
  }

  private handleResize(
    guide: HTMLDivElement,
    callback: (
      this: TimelineSerie,
      currentStart: number,
      initialStart: number,
      diff: number,
      currentDuration: number,
      initialDuration: number
    ) => void
  ) {
    guide.addEventListener("mousedown", (e: MouseEvent) => {
      let startX = e.screenX;
      let initialStart = this.getStart();
      let initialDuration = this.getDuration();
      let ratio = this.calculateRatio();
      let doDrag = (e: MouseEvent) => {
        let diff = (e.screenX - startX) / ratio;
        if (diff !== 0) {
          let currentStart = this.getStart();
          let currentDuration = this.getDuration();
          callback.call(
            this,
            currentStart,
            initialStart,
            diff,
            currentDuration,
            initialDuration
          );
        }
        e.preventDefault();
      };
      document.addEventListener("mousemove", doDrag);
      let stopDrag = (e: MouseEvent) => {
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
        e.preventDefault();
      };
      document.addEventListener("mouseup", stopDrag);
      e.preventDefault();
    });
  }

  updateLabel(start: number, duration: number) {
    let label = `${start.toFixed(2)} - ${(start + duration).toFixed(2)}`;
    this.#label.title = label;
    this.#label.textContent = label;
  }

  private resizeLeft(
    currentStart: number,
    initialStart: number,
    diff: number,
    currentDuration: number,
    initialDuration: number
  ): void {
    currentStart = initialStart + diff;
    currentDuration = initialDuration - diff;
    if (currentStart > initialStart + initialDuration || currentStart < 0) {
      return;
    }
    this.setStart(currentStart);
    this.setDuration(currentDuration);
    this.updateLabel(currentStart, currentDuration);
  }

  private resizeRight(
    currentStart: number,
    _initialStart: number,
    diff: number,
    currentDuration: number,
    initialDuration: number
  ): void {
    currentDuration = initialDuration + diff;
    if (currentDuration < 0) {
      return;
    }
    this.setDuration(currentDuration);
    this.updateLabel(currentStart, currentDuration);
  }

  private calculateRatio(): number {
    let style = getComputedStyle(this.#serie);
    return (
      (parseFloat(style.fontSize) *
        parseFloat(style.getPropertyValue("--zoom")) *
        window.devicePixelRatio) /
      2
    );
  }

  private getDuration() {
    return parseFloat(this.#serie.style.getPropertyValue("--duration"));
  }

  private setDuration(duration: number): void {
    this.#serie.style.setProperty("--duration", `${duration}`);
  }

  private getStart() {
    return parseFloat(this.#serie.style.getPropertyValue("--start"));
  }

  private setStart(start: number): void {
    this.#serie.style.setProperty("--start", `${start}`);
  }
}
