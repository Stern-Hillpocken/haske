import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameTime } from '../models/game-time.model';
import { GameWindow, GameWindowExploration, GameWindowLighthouse, GameWindowQuarry, GameWindowScrub, GameWindowStorage } from '../models/game-window.mode';
import { GameDrag } from '../models/game-drag.model';
import { DraggableNames } from '../types/draggable-names.type';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState(new GameDrag(), 5, new GameTime(), [
    new GameWindowStorage(),
    new GameWindowStorage(),
    new GameWindowExploration(),
    new GameWindowLighthouse()
  ]
  ));

  constructor() { }

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
    // When draggable is drop outside
    if (!windowEnd) {
      console.log("Outside")
      this._gameState$.value.drag = new GameDrag();
      this._gameState$.next(this._gameState$.value);
      return;
    }

    if (windowStart.content.includes(dragName) && windowEnd.acceptance.includes(dragName)) {
      windowStart.content.splice(windowStart.content.indexOf(dragName), 1);
      windowEnd.content.push(dragName);
      windowEnd.content.sort();
    } else {
      console.log("Drop impossible")
    }
    
    this._gameState$.value.drag = new GameDrag();
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
          if (window instanceof GameWindowExploration) {
            let explorables: GameWindow[] = [new GameWindowQuarry(), new GameWindowScrub()];
            let explored: GameWindow = explorables[this.random(0, explorables.length-1)];
            this._gameState$.value.windows.push(explored);

          } else if (window instanceof GameWindowQuarry || window instanceof GameWindowScrub) {
            window.usageRemaining --;
            switch (window.constructor) {
              case GameWindowQuarry: window.content.push("stone"); break;
              case GameWindowScrub: window.content.push("wood"); break;
            }
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
      let window: GameWindow = this._gameState$.value.windows[i];
      if (window instanceof GameWindowLighthouse) lighthouseIndex = i;
      if ((window instanceof GameWindowQuarry || window instanceof GameWindowScrub) && window.usageRemaining === 0) {
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
