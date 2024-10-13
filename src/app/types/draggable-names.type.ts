import { FoodNames } from "./food-names.type";
import { ItemNames } from "./item-names.type";
import { MonsterNames } from "./monster-names.type";
import { MonsterPartNames } from "./monster-part-names.type";
import { NoteNames } from "./note-names.type";
import { ResourceNames } from "./resource-names.type";
import { WorkerNames } from "./worker-names.type";

export type DraggableNames = "nothing" | WorkerNames | "pawn" | ResourceNames | ItemNames | NoteNames | MonsterPartNames | FoodNames | MonsterNames | "mana";