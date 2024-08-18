import { DraggableNames } from "../types/draggable-names.type";
import { ResourceNames } from "../types/resource-names.type";

export class Recipe {
    constructor(
        public name: DraggableNames,
        public resources: ResourceNames[],
        public quantity: number[],
        public duration: number,
    ) {}
}