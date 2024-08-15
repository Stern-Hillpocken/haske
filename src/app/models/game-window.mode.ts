import { DraggableNames } from "../types/draggable-names.type";
import { ResourceNames } from "../types/resource-names.type";
import { WindowNames } from "../types/window-names.type";

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class GameWindow {
    constructor(
        public name: WindowNames,
        public content: DraggableNames[],
        public acceptance: "all" | DraggableNames[],
        public currentTime?: number,
        public maxTime?: number,
        public usageRemaining?: number,
        public maxSpace?: number,
        public slot?: DraggableNames[]
    ) {}
}

export class GameWindowStorage extends GameWindow {
    constructor(
        public override name: WindowNames = "storage",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["stone", "water", "wood"],
        public override maxSpace: number = 14,
        public override slot: ResourceNames[] = []
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowExploration extends GameWindow {
    constructor(
        public override name: WindowNames = "exploration",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["cultist"],
        public override currentTime: number = 0,
        public override maxTime: number = 12
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowLighthouse extends GameWindow {
    constructor(
        public override name: WindowNames = "lighthouse",
        public override content: DraggableNames[] = ["cultist", "cultist"],
        public override acceptance: DraggableNames[] = ["cultist"]
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowQuarry extends GameWindow {
    constructor(
        public override name: WindowNames = "quarry",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["cultist"],
        public override currentTime: number = 0,
        public override maxTime: number = 8,
        public override usageRemaining: number =  random(2,5)
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowScrub extends GameWindow {
    constructor(
        public override name: WindowNames = "scrub",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["cultist"],
        public override currentTime: number = 0,
        public override maxTime: number = 8,
        public override usageRemaining: number =  random(2,5)
    ) {
        super(name, content, acceptance)
    }
}