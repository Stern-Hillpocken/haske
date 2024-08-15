import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameTime } from '../models/game-time.model';
import { GameWindow } from '../models/game-window.mode';
import { GameDrag } from '../models/game-drag.model';
import { DraggableNames } from '../types/draggable-names.type';
import { WindowNames } from '../types/window-names.type';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState(new GameDrag(-1, -1, "cultist"), 5, new GameTime(10, 1, 1), [
    new GameWindow("storage", ["water", "water"], ["water", "stone", "wood"]),
    new GameWindow("storage", ["water"], ["water", "stone", "wood"]),
    new GameWindow("exploration", [], ["cultist"], 0, 8),
    new GameWindow("lighthouse", ["cultist", "cultist"], ["cultist"])
  ]
  ));

  constructor () { }

  _getGameState$(): Observable<GameState> {
    return this._gameState$.asObservable();
  }

  onDragStart(altNameImage: DraggableNames, windowId: number): void {
    this._gameState$.value.drag.draggableName = altNameImage;
    this._gameState$.value.drag.windowStartId = windowId;
  }

  onDragEnter(windowId: number): void {
    this._gameState$.value.drag.windowEndId = windowId;
  }

  onDragEnd(): void {
    console.log(this._gameState$.value.drag)

    let windowStart = this._gameState$.value.windows[this._gameState$.value.drag.windowStartId];
    let windowEnd = this._gameState$.value.windows[this._gameState$.value.drag.windowEndId];
    let dragName = this._gameState$.value.drag.draggableName;
    if (!windowEnd) return; // When draggable is drop outside

    if (windowStart.content.includes(dragName) && windowEnd.acceptance.includes(dragName)) {
      windowStart.content.splice(windowStart.content.indexOf(dragName), 1);
      windowEnd.content.push(dragName);
      windowEnd.content.sort();
    } else {
      console.log("Drop impossible")
    }
    
    this._gameState$.value.drag.windowStartId = -1;
    this._gameState$.value.drag.windowEndId = -1;
    this._gameState$.value.drag.draggableName = "cultist";
    this._gameState$.next(this._gameState$.value);
  }

  tickTime(): void {
    this.timeAdvance();
    this.performTimedActions();
  }

  timeAdvance(): void {
    this._gameState$.value.time.tick ++;
    if (this._gameState$.value.time.tick === 5) {
      // Morning environment event
    } else if (this._gameState$.value.time.tick === 75) {
      // Newcomers
    } else if (this._gameState$.value.time.tick === 85) {
      // Attack of the monsters
    } else if (this._gameState$.value.time.tick > 100) {
      // Flame lost and new day
      this.flameLost();
      this._gameState$.value.time.tick = 0;
      this._gameState$.value.time.day ++;
    }
    this._gameState$.next(this._gameState$.value);
  }

  performTimedActions(): void {
    for (let window of this._gameState$.value.windows) {
      if (window.currentTime !== undefined && window.maxTime) {
        window.currentTime += window.content.filter(() => "cultist").length;
        if (window.currentTime >= window.maxTime) {
          window.currentTime = 0;
          // Perform
          if (window.name === "exploration") {
            let types: WindowNames[] = ["quarry", "scrub"];
            let randomType: WindowNames = types[this.random(0, types.length-1)];
            this._gameState$.value.windows.push(new GameWindow(randomType, [], ["cultist"], 0, 12, this.random(1, 4)));
          } else if (window.name === "quarry" || window.name === "scrub") {
            if (window.usageRemaining) window.usageRemaining --;
            window.name === "quarry" ? window.content.push("stone") : window.content.push("wood");
          }
        }
      }
    }
    this.removeNoUsageRemainingWindow();
    this._gameState$.next(this._gameState$.value);
  }

  removeNoUsageRemainingWindow(): void {
    let contentToStore: DraggableNames[] = [];
    let lighthouseIndex: number = 0;
    for(let i = 0; i < this._gameState$.value.windows.length; i++) {
      if (this._gameState$.value.windows[i].name === "lighthouse") lighthouseIndex = i;
      if (this._gameState$.value.windows[i].usageRemaining === 0) {
        contentToStore.push(... this._gameState$.value.windows[i].content);
        this._gameState$.value.windows.splice(i,1);
        i --;
      }
    }
    this._gameState$.value.windows[lighthouseIndex].content.push(... contentToStore);
    this._gameState$.next(this._gameState$.value);
  }

  flameLost(): void {
    this._gameState$.value.flame --;
    this._gameState$.next(this._gameState$.value);
  }

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
