import * as styles from "./styles.module.css";
import { TimelineSerie } from "./timeline_serie";

export class Timeline {
  #timeline: HTMLDivElement;
  #series: Array<TimelineSerie>;

  constructor(container: Element) {
    let timeline = document.createElement("div");
    timeline.className = styles.timeline;
    container.appendChild(timeline);
    this.#timeline = timeline;
    this.#series = [];
  }

  createSerie(start: number, end: number): TimelineSerie {
    let serie = new TimelineSerie(this.#timeline, start, end);
    this.#series.push(serie);
    return serie;
  }
}
