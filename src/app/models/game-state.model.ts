import { GameTime } from "./game-time.model";

export class GameState {
    constructor(
        public menuChoice: string,
        public windowStart: string,
        public objectDragged: string,
        public windowEnd: string,

        public flame: number,
        public time: GameTime
    ) {}
}