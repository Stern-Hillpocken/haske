import { GameDrag } from "./game-drag.model";
import { GameTime } from "./game-time.model";
import { GameWindow } from "./game-window.mode";

export class GameState {
    constructor(
        public drag: GameDrag,
        public flame: number,
        public time: GameTime,
        public windows: GameWindow[]
    ) {}
}