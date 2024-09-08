import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameTime } from '../models/game-time.model';
import { GameWindow, GameWindowDressing, GameWindowExploration, GameWindowFurnace, GameWindowGoal, GameWindowHelp, GameWindowLighthouse, GameWindowMine, GameWindowPantry, GameWindowQuarry, GameWindowRecipesBook, GameWindowRuin, GameWindowSawmill, GameWindowScrub, GameWindowStorage, GameWindowTrash, GameWindowWorkbench } from '../models/game-window.model';
import { GameDrag } from '../models/game-drag.model';
import { DraggableNames } from '../types/draggable-names.type';
import { ResourceNames } from '../types/resource-names.type';
import { PopupService } from './popup.service';
import { RecipesService } from './recipes.service';
import { WindowNames } from '../types/window-names.type';
import { GoalService } from './goal.service';
import { FoodNames } from '../types/food-names.type';
import { MonsterPartNames } from '../types/monster-part-names.type';
import { GoalTriggerNames } from '../types/goal-trigger-names.type';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState(new GameDrag(), 10, new GameTime(), [
    new GameWindowGoal(),
    new GameWindowStorage(),
    new GameWindowExploration(),
    new GameWindowLighthouse()
  ]
  ));

  windowsWhichCanPause: WindowNames[] = ["exploration", "scrub", "quarry"];
  workerNames: DraggableNames[] = ["worker", "miner"];

  constructor(private popupService: PopupService, private recipesServices: RecipesService, private goalService: GoalService) { }

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
    } else if (this._gameState$.value.windows[this._gameState$.value.drag.windowEndId] instanceof GameWindowHelp || this._gameState$.value.windows[this._gameState$.value.drag.windowEndId] instanceof GameWindowRecipesBook || this._gameState$.value.windows[this._gameState$.value.drag.windowEndId] instanceof GameWindowGoal) {
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
    if ((windowEnd instanceof GameWindowHelp || windowEnd instanceof GameWindowRecipesBook) && windowEnd.slot.length === 1) {
      this.popupService.pushValue("error", "Il y a déjà un élément ici");
      return;
    }
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
    if ((windowEnd instanceof GameWindowHelp || windowEnd instanceof GameWindowRecipesBook) && windowEnd.slot.length === 1) {
      this.popupService.pushValue("error", "Il y a déjà un élément ici");
      return;
    }
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
      if (this._gameState$.value.time.day === 4) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-event");

    } else if(this._gameState$.value.time.day === 1 && this._gameState$.value.time.tick === 11) {
      this._gameState$.value.windows[this.indexOfWindow("storage")].content.push("bread", "fiber", "fiber", "monster-eye");

    } else if (this._gameState$.value.time.day === 1 && this._gameState$.value.time.tick === 40) {
      this._gameState$.value.windows.push(
        new GameWindowHelp(),
        new GameWindowWorkbench()
      );
      this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-exploration-x-time");

    } else if (this._gameState$.value.time.day === 1 && this._gameState$.value.time.tick === 60) {
      this._gameState$.value.windows.push(
        new GameWindowTrash(),
        new GameWindowRecipesBook()
      );

    } else if (this._gameState$.value.time.tick === 75) {
      // Newcomers
      if (this._gameState$.value.time.day === 2) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-newcomers");

    } else if (this._gameState$.value.time.tick === 85) {
      if (this._gameState$.value.time.day === 1) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-time-strip");
      // Attack of the monsters
      if (this._gameState$.value.time.day === 5) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-fight");

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

        } else if (window instanceof GameWindowFurnace) {
          // Add fuel
          if (window.slot.includes("stick")) {
            window.power += 4 * window.slot.filter((e) => e === "stick").length;
            window.slot = window.slot.filter((e) => e !== "stick");
          }
          if (window.slot.includes("plank")) {
            window.power += 8 * window.slot.filter((e) => e === "plank").length;
            window.slot = window.slot.filter((e) => e !== "plank");
          }
          if (window.slot.includes("wood")) {
            window.power += 16 * window.slot.filter((e) => e === "wood").length;
            window.slot = window.slot.filter((e) => e !== "wood");
          }
          if (window.slot.includes("charcoal")) {
            window.power += 48 * window.slot.filter((e) => e === "charcoal").length;
            window.slot = window.slot.filter((e) => e !== "charcoal");
          }
          // See if it can smelt
          if (window.power > 0 && (window.content.includes("wood") || window.content.includes("iron-ore"))) {
            window.currentTime ++;
            window.power --;
          }

        } else if (!(window instanceof GameWindowWorkbench) || (window instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(window.content) !== "nothing")) {
          window.currentTime += window.content.filter((name) => this.workerNames.includes(name)).length;
        }

        // Max time
        if (window.currentTime >= window.maxTime) {
          window.currentTime = 0;
          // Perform
          if (window instanceof GameWindowExploration) {
            let pN: number = 10;
            let pQ: number = 20;
            let pS: number = 40;
            let pM: number = 20;
            let pR: number = 10;
            let rand: number = this.random(0, 100);
            if (rand < pN) {
              this.popupService.pushValue("info", "L’exploration n’a rien donnée");
            } else if (rand < pN+pQ) {
              let index: number = this.indexOfWindow("quarry");
              if (index !== -1 && this._gameState$.value.windows[index]) {
                (this._gameState$.value.windows[index].usageRemaining as number) += this.random(2,5);
              } else this._gameState$.value.windows.push(new GameWindowQuarry());
            } else if (rand < pN+pQ+pS) {
              let index: number = this.indexOfWindow("scrub");
              if (index !== -1 && this._gameState$.value.windows[index]) {
                (this._gameState$.value.windows[index].usageRemaining as number) += this.random(2,5);
              } else this._gameState$.value.windows.push(new GameWindowScrub());
            } else if (rand < pN+pQ+pS+pM) {
              let index: number = this.indexOfWindow("mine");
              if (index !== -1 && this._gameState$.value.windows[index]) {
                  (this._gameState$.value.windows[index].usageRemaining as number) += this.random(1,3);
              }  else this._gameState$.value.windows.push(new GameWindowMine());
            } else if (rand < pN+pQ+pS+pM+pR) {
              let index: number = this.indexOfWindow("ruin");
              if (index !== -1 && this._gameState$.value.windows[index]) {
                  (this._gameState$.value.windows[index].usageRemaining as number) += this.random(1,3);
              }  else this._gameState$.value.windows.push(new GameWindowRuin());
            }
            this.goalService.launchTrigger("exporation");

          } else if (window instanceof GameWindowQuarry || window instanceof GameWindowScrub || window instanceof GameWindowMine || window instanceof GameWindowRuin) {
            let resourceName: DraggableNames = "nothing";
            switch (window.constructor) {
              case GameWindowQuarry:
                resourceName = "stone";
                this.goalService.launchTrigger("gather-stone");
                break;
              case GameWindowScrub:
                if (this.random(0, 100) < 80) {
                  resourceName = "wood";
                  this.goalService.launchTrigger("gather-wood");
                } else {
                  resourceName = "fiber";
                  this.goalService.launchTrigger("gather-fiber");
                }
                break;
              case GameWindowMine:
                resourceName = "iron-ore";
                this.goalService.launchTrigger("gather-iron-ore");
                break;
              case GameWindowRuin:
                let pRuinN: number = 50;
                let pRuinB: number = 30;
                let pRuinE: number = 20;
                let randRuinObj: number = this.random(0, 100);
                if (randRuinObj < pRuinN) {}
                else if (randRuinObj < pRuinN+pRuinB) resourceName = "bread";
                else if (randRuinObj < pRuinN+pRuinB+pRuinE) resourceName = "monster-eye";
                break;
            }
            let storageId: number = resourceName === "nothing" ? -1 : this.indexOfFirstOpenedStorage(resourceName);
            if (storageId !== -1) {
              window.usageRemaining --;
              this._gameState$.value.windows[storageId].content.push(resourceName);
              this._gameState$.value.windows[storageId].content.sort();
            } else {
              window.currentTime = window.maxTime;
            }
          } else if (window instanceof GameWindowWorkbench) {
            let recipeName: DraggableNames | WindowNames = this.recipesServices.recipeDoable(window.content);
            this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push(...window.content.filter((name) => name === "worker"));
            window.content = [];
            if (recipeName === "pickaxe" || recipeName === "plank" || recipeName === "stick" || recipeName === "fabric") {
              window.content = [recipeName];
              this.goalService.launchTrigger("make-"+recipeName as GoalTriggerNames);
            } else {
              if (recipeName === "storage") this._gameState$.value.windows.push(new GameWindowStorage ());
              else if (recipeName === "dressing") this._gameState$.value.windows.push(new GameWindowDressing());
              else if (recipeName === "furnace") this._gameState$.value.windows.push(new GameWindowFurnace());
              else if (recipeName === "sawmill") this._gameState$.value.windows.push(new GameWindowSawmill());
              this.goalService.launchTrigger("build-"+recipeName as GoalTriggerNames);
            }

          } else if (window instanceof GameWindowDressing) {
            let item: DraggableNames = window.content.filter((name) => !this.workerNames.includes(name))[0];
            window.content = window.content.filter((name) => this.workerNames.includes(name));
            window.content.shift();
            if (item === "pickaxe") {
              window.content.push("miner");
              this.goalService.launchTrigger("equip-miner");
            }
          } else if (window instanceof GameWindowFurnace) {
            if (window.content.includes("wood")) {
              window.content = ["charcoal"];
              this.goalService.launchTrigger("melt-charcoal");
            }
            if (window.content.includes("iron-ore")) {
              window.content = ["iron"];
              this.goalService.launchTrigger("melt-iron");
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
      if ((window instanceof GameWindowQuarry || window instanceof GameWindowScrub || window instanceof GameWindowMine || window instanceof GameWindowRuin) && window.usageRemaining === 0) {
        contentToStore.push(... this._gameState$.value.windows[i].content);
        this._gameState$.value.windows.splice(i,1);
        i --;
      }
    }
    this._gameState$.value.windows[lighthouseIndex].content.push(... contentToStore);
    this._gameState$.next(this._gameState$.value);
  }

  indexOfFirstOpenedStorage(resourceName: ResourceNames | FoodNames | MonsterPartNames): number {
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
