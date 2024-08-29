import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameTime } from '../models/game-time.model';
import { GameWindow, GameWindowDressing, GameWindowExploration, GameWindowHelp, GameWindowLighthouse, GameWindowQuarry, GameWindowRecipesBook, GameWindowScrub, GameWindowStorage, GameWindowTrash, GameWindowWorkbench } from '../models/game-window.model';
import { GameDrag } from '../models/game-drag.model';
import { DraggableNames } from '../types/draggable-names.type';
import { ResourceNames } from '../types/resource-names.type';
import { PopupService } from './popup.service';
import { RecipesService } from './recipes.service';
import { WindowNames } from '../types/window-names.type';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState(new GameDrag(), 5, new GameTime(), [
    new GameWindowWorkbench(),
    new GameWindowDressing(),
    new GameWindowStorage(),
    new GameWindowStorage(),
    new GameWindowRecipesBook(),
    new GameWindowTrash(),
    new GameWindowExploration(),
    new GameWindowLighthouse(),
    new GameWindowHelp()
  ]
  ));

  windowsWhichCanPause: WindowNames[] = ["exploration", "scrub", "quarry"];
  workerNames: DraggableNames[] = ["worker", "miner"];

  constructor(private popupService: PopupService, private recipesServices: RecipesService) { }

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
    if (this._gameState$.value.drag.windowEndId === -1) {
      this.popupService.pushValue("error", "En dehors");
      this._gameState$.value.drag = new GameDrag();
      this._gameState$.next(this._gameState$.value);
    } else if (this._gameState$.value.windows[this._gameState$.value.drag.windowEndId] instanceof GameWindowHelp || this._gameState$.value.windows[this._gameState$.value.drag.windowEndId] instanceof GameWindowRecipesBook) {
      this.popupService.pushValue("error", "Impossible de stocker dans du texte");
      this._gameState$.value.drag = new GameDrag();
      this._gameState$.next(this._gameState$.value);
    } else if(this._gameState$.value.drag.windowEndId + 0.5 === Math.floor(this._gameState$.value.drag.windowEndId)+1 && this._gameState$.value.drag.windowStartId + 0.5 === Math.floor(this._gameState$.value.drag.windowStartId)+1) {
      this.onDragEndFromSlotOnSlot();
    } else if (this._gameState$.value.drag.windowEndId + 0.5 === Math.floor(this._gameState$.value.drag.windowEndId)+1) {
      this.onDragEndOnSlot();
    } else if (this._gameState$.value.drag.windowStartId + 0.5 === Math.floor(this._gameState$.value.drag.windowStartId)+1) {
      this.onDragEndFromSlot();
    } else {
      let windowStart = this._gameState$.value.windows[this._gameState$.value.drag.windowStartId];
      let windowEnd = this._gameState$.value.windows[this._gameState$.value.drag.windowEndId];
      let dragName = this._gameState$.value.drag.draggableName;

      if (windowEnd instanceof GameWindowStorage && windowEnd.content.filter((name) => name !== "worker").length === windowEnd.maxSpace) {
        this.popupService.pushValue("error", "Plus de place");
      } else if (windowStart instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(windowStart.content) !== "nothing" && windowStart.currentTime !== 0) {
        this.popupService.pushValue("error", "La recette doit être menée à son terme");
      } else if (windowEnd instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(windowEnd.content) === "nothing" && dragName === "worker") {
        this.popupService.pushValue("error", "La recette doit être correcte avant d’y assigner des ouvriers");
      } else if (windowStart.content.includes(dragName) && windowEnd.acceptance.includes(dragName)) {
        windowStart.content.splice(windowStart.content.indexOf(dragName), 1);
        windowEnd.content.push(dragName);
        windowEnd.content.sort();
      } else {
        this.popupService.pushValue("error", "Drop impossible");
      }
      
      this._gameState$.value.drag = new GameDrag();
      this._gameState$.next(this._gameState$.value);
    }
  }

  onDragEndFromSlotOnSlot(): void {
    let windowEnd: GameWindow = this._gameState$.value.windows[Math.floor(this._gameState$.value.drag.windowEndId)];
    let windowStart: GameWindow = this._gameState$.value.windows[Math.floor(this._gameState$.value.drag.windowStartId)];
    let dragName: DraggableNames = this._gameState$.value.drag.draggableName;
    //
    if (windowStart.slot?.includes(dragName) && windowEnd.acceptance.includes(dragName) && !windowEnd.slot?.includes(dragName)) {
      windowEnd.slot?.push(dragName);
      windowEnd.slot?.sort();
      windowStart.slot.splice(windowStart.slot.indexOf(dragName), 1);
    } else {
      this.popupService.pushValue("error", "Drop impossible de slot en slot");
    }
    //
    this._gameState$.value.drag = new GameDrag();
    this._gameState$.next(this._gameState$.value);
  }

  onDragEndOnSlot(): void {
    let windowEnd: GameWindow = this._gameState$.value.windows[Math.floor(this._gameState$.value.drag.windowEndId)];
    let windowStart: GameWindow = this._gameState$.value.windows[this._gameState$.value.drag.windowStartId];
    let dragName: DraggableNames = this._gameState$.value.drag.draggableName;
    //
    if (windowStart.content.includes(dragName) && windowEnd.acceptance.includes(dragName) && !windowEnd.slot?.includes(dragName) && (windowStart.currentTime === undefined || windowStart.currentTime === 0)) {
      windowEnd.slot?.push(dragName);
      windowEnd.slot?.sort();
      windowStart.content.splice(windowStart.content.indexOf(dragName), 1);
    } else if (!this.windowsWhichCanPause.includes(windowStart.name) && windowStart.currentTime && windowStart.currentTime > 0) {
      this.popupService.pushValue("error", "Pas possible de sortir alors que l’action est en cours");
    } else {
      this.popupService.pushValue("error", "Drop impossible dans le slot");
    }
    //
    this._gameState$.value.drag = new GameDrag();
    this._gameState$.next(this._gameState$.value);
  }

  onDragEndFromSlot(): void {
    let windowEnd: GameWindow = this._gameState$.value.windows[this._gameState$.value.drag.windowEndId];
    let windowStart: GameWindow = this._gameState$.value.windows[Math.floor(this._gameState$.value.drag.windowStartId)];
    let dragName: DraggableNames = this._gameState$.value.drag.draggableName;
    //
    if (windowEnd instanceof GameWindowStorage && windowEnd.content.length === windowEnd.maxSpace) {
      this.popupService.pushValue("error", "Plus de place");
    } else if (windowEnd instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(windowEnd.content) === "nothing" && windowEnd.content.length > 0) {
      this.popupService.pushValue("error", "Atelier non prêt");
    } else if (windowStart.slot?.includes(dragName) && windowEnd.acceptance.includes(dragName)) {
      windowStart.slot.splice(windowStart.slot.indexOf(dragName), 1);
      windowEnd.content.push(dragName);
      windowEnd.content.sort();
    } else {
      this.popupService.pushValue("error", "Drop impossible depuis le slot");
    }
    //
    this._gameState$.value.drag = new GameDrag();
    this._gameState$.next(this._gameState$.value);
  }

  tickTime(): void {
    this.timeAdvance();
    this.performTimedActions();
    this.emptyTrash();
  }

  timeAdvance(): void {
    this._gameState$.value.time.tick ++;
    if (this._gameState$.value.time.tick === 5) {
      // Morning environment event
      if (this._gameState$.value.time.day === 3) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-event");

    } else if (this._gameState$.value.time.tick === 75) {
      // Newcomers
      if (this._gameState$.value.time.day === 2) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-newcomers");

    } else if (this._gameState$.value.time.tick === 85) {
      // Attack of the monsters
      if (this._gameState$.value.time.day === 4) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-fight");

    } else if (this._gameState$.value.time.tick > 100) {
      // Flame lost and new day
      if (this._gameState$.value.time.day === 1) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-end-day");
      this.flameLost();
      this._gameState$.value.time.tick = 0;
      this._gameState$.value.time.day ++;
    }
    this._gameState$.next(this._gameState$.value);
  }

  performTimedActions(): void {
    for (let window of this._gameState$.value.windows) {
      if (window.currentTime !== undefined && window.maxTime) {
        // Add time
        if (window instanceof GameWindowDressing) {
          if (window.content.filter((name) => !this.workerNames.includes(name)).length > 0 && window.content.filter((name) => this.workerNames.includes(name)).length > 0) {
            window.currentTime ++;
          }
        } else if (!(window instanceof GameWindowWorkbench) || (window instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(window.content) !== "nothing")) {
          window.currentTime += window.content.filter((name) => this.workerNames.includes(name)).length;
        }
        // Max time
        if (window.currentTime >= window.maxTime) {
          window.currentTime = 0;
          // Perform
          if (window instanceof GameWindowExploration) {
            let explorables: GameWindow[] = [new GameWindowQuarry(), new GameWindowScrub()];
            let explored: GameWindow = explorables[this.random(0, explorables.length-1)];
            this._gameState$.value.windows.push(explored);

          } else if (window instanceof GameWindowQuarry || window instanceof GameWindowScrub) {
            let resourceName: ResourceNames = "water";
            switch (window.constructor) {
              case GameWindowQuarry: resourceName = "stone"; break;
              case GameWindowScrub: resourceName = "wood"; break;
            }
            let storageId: number = this.indexOfFirstOpenedStorage(resourceName);
            if (storageId !== -1) {
              window.usageRemaining --;
              this._gameState$.value.windows[storageId].content.push(resourceName);
              this._gameState$.value.windows[storageId].content.sort();
            } else {
              window.currentTime = window.maxTime;
            }
          } else if (window instanceof GameWindowWorkbench) {
            let recipeName: DraggableNames = this.recipesServices.recipeDoable(window.content);
            window.content = window.content.filter((name) => name === "worker");
            window.content.push(recipeName);
          } else if (window instanceof GameWindowDressing) {
            let item: DraggableNames = window.content.filter((name) => !this.workerNames.includes(name))[0];
            window.content = window.content.filter((name) => this.workerNames.includes(name));
            window.content.shift();
            if (item === "pickaxe") window.content.push("miner");
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

  indexOfFirstOpenedStorage(resourceName: ResourceNames): number {
    for(let i = 0; i < this._gameState$.value.windows.length; i++) {
      let window: GameWindow = this._gameState$.value.windows[i];
      if (window instanceof GameWindowStorage && window.content.length < window.maxSpace && (window.slot.length === 0 || window.slot.includes(resourceName))) return i;
    }
    this.popupService.pushValue("error", "Plus de place dans les entrepôts");
    return -1;
  }

  indexOfWindow(name: WindowNames): number {
    for (let i = 0; i < this._gameState$.value.windows.length; i++) {
      if (this._gameState$.value.windows[i].name === name) return i;
    }
    return -1;
  }

  emptyTrash(): void {
    for (let window of this._gameState$.value.windows) {
      if (window.name === 'trash') {
        window.slot = [];
        break;
      }
    }
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
