import { DraggableNames } from "../types/draggable-names.type";

export class Trade {
    constructor(
        public wantName: DraggableNames,
        public wantQuantity: number,
        public giveName: DraggableNames,
        public giveQuantity: number
    ) {}
}