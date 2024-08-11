import { DraggableNames } from "../types/draggable-names.type";
import { WindowNames } from "../types/window-names.type";

export class GameWindow {
    constructor (
        public name: WindowNames,
        public content: DraggableNames[],
        public acceptance: "all" | DraggableNames[]
    ) {}
}