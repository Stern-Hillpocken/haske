import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { Router } from '@angular/router';
import { GameTime } from '../models/game-time.model';
import { GameWindow } from '../models/game-window.mode';
import { GameDrag } from '../models/game-drag.model';
import { DraggableNames } from '../types/draggable-names.type';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState(new GameDrag(-1, -1, "cultist"), 5, new GameTime(10, 1, 1), [
    new GameWindow("storage", ["water", "water"], ["cultist", "water"]),
    new GameWindow("storage", ["water"], ["cultist", "water"]),
    new GameWindow("exploration", [], ["cultist"]),
    new GameWindow("lighthouse", ["cultist"], ["cultist"])
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
    this._gameState$.next(this._gameState$.value)
  }

  tickTime(): void {
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

  flameLost(): void {
    this._gameState$.value.flame --;
    this._gameState$.next(this._gameState$.value);
  }
}
