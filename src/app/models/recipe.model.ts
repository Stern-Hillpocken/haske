import { DraggableNames } from "../types/draggable-names.type";
import { ResourceNames } from "../types/resource-names.type";
import { WindowNames } from "../types/window-names.type";

export class Recipe {
    constructor(
        public name: DraggableNames[] | WindowNames,
        public resources: ResourceNames[],
        public quantity: number[],
        public duration: number,
    ) {}
}