import { DraggableNames } from "../types/draggable-names.type";

export class GameDrag {
    constructor (
        public windowStartId: number = -1,
        public windowEndId: number = -1,
        public draggableName: DraggableNames = "nothing"
    ) {}
}