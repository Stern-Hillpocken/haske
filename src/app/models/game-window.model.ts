import { DraggableNames } from "../types/draggable-names.type";
import { FoodNames } from "../types/food-names.type";
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
        public slot?: DraggableNames[],
        public power?: number
    ) {}
}

export class GameWindowStorage extends GameWindow {
    constructor(
        public override name: WindowNames = "storage",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["mana", "stone", "water", "charcoal", "wood", "plank", "stick", "fiber", "fabric", "iron-ore", "iron", "pickaxe", "weapon-contact", "weapon-distance", "armor", "lizard", "hare", "skin", "millet-seed", "millet", "flour", "dough", "bread", "raw-meat", "meat", "monster-eye", "unequip-tool", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip", "note-exploration-x-time"],
        public override maxSpace: number = 14,
        public override slot: DraggableNames[] = []
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowPantry extends GameWindow {
    constructor(
        public override name: WindowNames = "pantry",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["bread", "meat", "monster-eye"],
        public override slot: DraggableNames[] = []
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
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["mana", "worker", "miner", "fighter", "archer", "fighter-reinforced", "archer-reinforced", "unequip-tool", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip", "note-fight"]
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
        public override usageRemaining: number =  random(1,3)
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowRuin extends GameWindow {
    constructor(
        public override name: WindowNames = "ruin",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["worker", "miner"],
        public override currentTime: number = 0,
        public override maxTime: number = 18,
        public override usageRemaining: number =  random(1,3)
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowTrash extends GameWindow {
    constructor(
        public override name: WindowNames = "trash",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["mana", "stone", "water", "charcoal", "wood", "plank", "stick", "fiber", "fabric", "iron-ore", "iron", "millet-seed", "millet", "flour", "dough", "bread", "lizard", "hare", "skin", "raw-meat", "meat", "pickaxe", "weapon-contact", "weapon-distance", "armor", "monster-eye", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip", "note-exploration-x-time"],
        public override slot: ResourceNames[] = []
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowHelp extends GameWindow {
    constructor(
        public override name: WindowNames = "help",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["mana", "worker", "miner", "fighter", "archer", "fighter-reinforced", "archer-reinforced", "stone", "water", "charcoal", "wood", "plank", "stick", "fiber", "fabric", "iron-ore", "iron", "millet-seed", "millet", "flour", "dough", "bread", "lizard", "hare", "skin", "raw-meat", "meat", "pickaxe", "weapon-contact", "weapon-distance", "armor", "unequip-tool", "note-help-and-trash", "note-event-event", "note-event-newcomers", "note-event-fight", "note-event-end-day", "note-storage-filter", "note-time-strip", "note-exploration-x-time"],
        public override slot: DraggableNames[] = ["note-help-and-trash"]
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowRecipesBook extends GameWindow {
    constructor(
        public override name: WindowNames = "recipes-book",
        public override content: DraggableNames[] = [],
        public override acceptance: ResourceNames[] = ["stone", "water", "wood", "plank", "stick", "fiber", "fabric", "iron", "lizard", "hare", "skin", "millet", "flour"],
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
        public override acceptance: DraggableNames[] = ["worker", "stone", "water", "wood", "plank", "stick", "fiber", "fabric", "iron", "lizard", "hare", "millet", "flour"],
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
        public override content: DraggableNames[] = ["unequip-tool"],
        public override acceptance: DraggableNames[] = ["unequip-tool", "worker", "pickaxe", "miner", "weapon-contact", "fighter", "weapon-distance", "archer", "armor", "archer-reinforced", "fighter-reinforced"],
        public override currentTime: number = 0,
        public override maxTime: number = 6,
        public override maxSpace: number = 1
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowFurnace extends GameWindow {
    constructor(
        public override name: WindowNames = "furnace",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["iron-ore", "charcoal", "wood", "plank", "stick", "raw-meat", "dough"],
        public override currentTime: number = 0,
        public override maxTime: number = 16,
        public override maxSpace: number = 3,
        public override slot: ResourceNames[] = [],
        public override power: number = 0
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowSawmill extends GameWindow {
    constructor(
        public override name: WindowNames = "sawmill",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["worker", "wood", "plank"],
        public override currentTime: number = 0,
        public override maxTime: number = 10,
        public override maxSpace: number = 3
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowField extends GameWindow {
    constructor(
        public override name: WindowNames = "field",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["millet-seed", "water"],
        public override currentTime: number = 0,
        public override maxTime: number = 20,
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowBattlefield extends GameWindow {
    constructor(
        public override name: WindowNames = "battlefield",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["fighter", "archer", "fighter-reinforced", "archer-reinforced"],
        public override currentTime: number = 0,
        public override maxTime: number = 20,
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowSiper extends GameWindow {
    constructor(
        public override name: WindowNames = "siper",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["water", "mana", "worker", "hare", "lizard", "fiber", "wood"],
        public override currentTime: number = 0,
        public override maxTime: number = 10,
        public override slot: DraggableNames[] = [],
        public override power: number = 0
    ) {
        super(name, content, acceptance)
    }
}

export class GameWindowTrader extends GameWindow {
    constructor(
        public override name: WindowNames = "trader",
        public override content: DraggableNames[] = [],
        public override acceptance: DraggableNames[] = ["wood", "stone", "hare", "bread", "charcoal", "iron", "skin"],
        public override slot: DraggableNames[] = [],
    ) {
        super(name, content, acceptance)
    }
}