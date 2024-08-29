import { DraggableNames } from "../types/draggable-names.type";
import { MonsterPartNames } from "../types/monster-part-names.type";
import { NoteNames } from "../types/note-names.type";
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
        public override acceptance: DraggableNames[] = ["stone", "water", "wood", "iron-ore", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip"],
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
        public override acceptance: DraggableNames[] = ["worker", "miner"],
        public override currentTime: number = 0,
        public override maxTime: number = 12
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowLighthouse extends GameWindow {
    constructor(
        public override name: WindowNames = "lighthouse",
        public override content: DraggableNames[] = ["worker", "worker", "worker", "note-time-strip"],
        public override acceptance: DraggableNames[] = ["worker", "miner", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip"]
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowQuarry extends GameWindow {
    constructor(
        public override name: WindowNames = "quarry",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["worker", "miner"],
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
        public override acceptance: DraggableNames[] = ["worker", "miner"],
        public override currentTime: number = 0,
        public override maxTime: number = 8,
        public override usageRemaining: number =  random(2,5)
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowMine extends GameWindow {
    constructor(
        public override name: WindowNames = "mine",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["miner"],
        public override currentTime: number = 0,
        public override maxTime: number = 12,
        public override usageRemaining: number =  random(2,4)
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowTrash extends GameWindow {
    constructor(
        public override name: WindowNames = "trash",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["stone", "water", "wood", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip"],
        public override slot: ResourceNames[] = []
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowHelp extends GameWindow {
    constructor(
        public override name: WindowNames = "help",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["worker", "stone", "water", "wood", "iron-ore", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip"],
        public override slot: DraggableNames[] = ["note-help-and-trash"]
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowRecipesBook extends GameWindow {
    constructor(
        public override name: WindowNames = "recipes-book",
        public override content: DraggableNames[] = [],
        public override acceptance: ResourceNames[] = ["stone", "water", "wood"],
        public override slot: ResourceNames[] = []
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowGoal extends GameWindow {
    constructor(
        public override name: WindowNames = "goal",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["monster-eye"],
        public override slot: MonsterPartNames[] = []
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowWorkbench extends GameWindow {
    constructor(
        public override name: WindowNames = "workbench",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["worker", "stone", "water", "wood"],
        public override currentTime: number = 0,
        public override maxTime: number = 12,
        public override maxSpace: number = 8
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowDressing extends GameWindow {
    constructor(
        public override name: WindowNames = "dressing",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["worker", "pickaxe", "miner"],
        public override currentTime: number = 0,
        public override maxTime: number = 6,
        public override maxSpace: number = 1
    ) {
        super(name, content, acceptance)
    }
}