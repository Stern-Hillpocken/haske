import { DraggableNames } from "../types/draggable-names.type";

export class GameDrag {
    constructor (
        public windowStartId: number,
        public windowEndId: number,
        public draggableName: DraggableNames
    ) {}
}