import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { GameTime } from '../models/game-time.model';
import { GameWindow, GameWindowBattlefield, GameWindowDressing, GameWindowExploration, GameWindowField, GameWindowFurnace, GameWindowGoal, GameWindowHelp, GameWindowLighthouse, GameWindowMine, GameWindowPantry, GameWindowQuarry, GameWindowRecipesBook, GameWindowRuin, GameWindowSawmill, GameWindowScrub, GameWindowStorage, GameWindowTrash, GameWindowWorkbench } from '../models/game-window.model';
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
import { UtilsService } from './utils.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState(true, new GameDrag(), 0, 0, 0, new GameTime(), []));

  windowsWhichCanPause: WindowNames[] = ["exploration", "scrub", "quarry"];
  workerNames: DraggableNames[] = ["worker", "miner", "fighter", "archer", "fighter-reinforced", "archer-reinforced"];

  constructor(private router: Router, private popupService: PopupService, private recipesServices: RecipesService, private goalService: GoalService, private utils: UtilsService) { }

  _getGameState$(): Observable<GameState> {
    return this._gameState$.asObservable();
  }

  init(isTuto: boolean): void {
    this._gameState$.value.isTuto = isTuto;
    this._gameState$.value.drag = new GameDrag();
    this._gameState$.value.flame = 10;
    this._gameState$.value.people = 0;
    this._gameState$.value.food = 0;
    this._gameState$.value.time = new GameTime();
    this._gameState$.value.windows = [];
    this._gameState$.next(this._gameState$.value);
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

      if (windowEnd.maxSpace !== undefined && windowEnd.content.filter((name) => !this.workerNames.includes(name)).length >= windowEnd.maxSpace && !this.workerNames.includes(dragName)) {
        this.popupService.pushValue("error", "Plus de place");
      } else if (windowStart instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(windowStart.content)[0] !== "nothing" && windowStart.currentTime !== 0) {
        this.popupService.pushValue("error", "La recette doit être menée à son terme");
      } else if (windowEnd instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(windowEnd.content)[0] === "nothing" && dragName === "worker") {
        this.popupService.pushValue("error", "La recette doit être correcte avant d’y assigner des ouvriers");
      } else if (windowEnd instanceof GameWindowField && windowEnd.currentTime > 0 && dragName !== "water") {
        this.popupService.pushValue("error", "Champs déjà utilisé");
      } else if (windowStart.content.includes(dragName) && windowEnd.acceptance.includes(dragName)) {
        windowStart.content.splice(windowStart.content.indexOf(dragName), 1);
        windowEnd.content.push(dragName);
        if (windowEnd !instanceof GameWindowFurnace && windowEnd !instanceof GameWindowSawmill) windowEnd.content.sort();
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
    } /* else if (windowEnd instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(windowEnd.content)[0] === "nothing" && windowEnd.content.length > 0) {
      this.popupService.pushValue("error", "Atelier non prêt");
    }*/ else if (windowEnd instanceof GameWindowWorkbench && windowEnd.currentTime > 0) {
      this.popupService.pushValue("error", "Atelier déjà utilisé");
    } else if (windowEnd instanceof GameWindowField && windowEnd.currentTime > 0 && dragName !== "water") {
      this.popupService.pushValue("error", "Champs déjà utilisé");
    } else if (windowStart.slot?.includes(dragName) && windowEnd.acceptance.includes(dragName)) {
      windowStart.slot.splice(windowStart.slot.indexOf(dragName), 1);
      windowEnd.content.push(dragName);
      if (windowEnd !instanceof GameWindowFurnace && windowEnd !instanceof GameWindowSawmill) windowEnd.content.sort();
    } else {
      this.popupService.pushValue("error", "Drop impossible depuis le slot");
    }
    //
    this._gameState$.value.drag = new GameDrag();
    this._gameState$.next(this._gameState$.value);
  }

  ////////////////////////////////////////////////

  tickTime(): void {
    this.timeAdvance();
    this.performTimedActions();
    this.emptyTrash();
    this.emptyPantrySlot();
    this.countPeople();
  }

  timeAdvance(): void {
    if (this._gameState$.value.time.day === 1 && this._gameState$.value.time.tick === 15) this._gameState$.next(this.testChangeSetup(this._gameState$.value));
    this._gameState$.value.time.tick ++;
    // Setup
    if (this._gameState$.value.time.day === 1) {
      if (!this._gameState$.value.isTuto) {
        if (this._gameState$.value.time.tick === 11) {
          this._gameState$.value.windows.push(
            new GameWindowPantry(),
            new GameWindowHelp(),
            new GameWindowTrash(),
            new GameWindowRecipesBook(),
            new GameWindowWorkbench(),
            new GameWindowStorage(),
            new GameWindowExploration(),
            new GameWindowLighthouse()
          );
          this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content = ["worker", "worker", "water", "water"];
        }
      } else {
        // TUTO
        switch (this._gameState$.value.time.tick) {
          case 11:
            this._gameState$.value.windows.push(new GameWindowGoal()); break;
          case 15:
            this._gameState$.value.windows.push(new GameWindowLighthouse());
            this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content = ["worker", "worker", "worker", "water", "water"];
            break;
          case 17:
            this._gameState$.value.windows.push(new GameWindowExploration()); break;
          case 27:
            this._gameState$.value.windows.push(new GameWindowStorage());
            this._gameState$.value.windows[this.indexOfWindow("storage")].content.push("fiber", "fiber", "monster-eye");
            break;
          case 40:
            this._gameState$.value.windows.push(new GameWindowHelp());
            this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-exploration-x-time");
            break;
          case 50:
            this._gameState$.value.windows.push(new GameWindowWorkbench()); break;
          case 54:
            this._gameState$.value.windows.push(new GameWindowTrash()); break;
          case 58:
            this._gameState$.value.windows.push(new GameWindowRecipesBook()); break;
          case 85:
            this._gameState$.value.windows.push(new GameWindowPantry());
            this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-end-day");
            break;
        }
      }
    }
    
    // Time related actions for no tuto
    if (!this._gameState$.value.isTuto) {
      if (this._gameState$.value.time.tick === 5) {
        // Morning environment event
        if (this._gameState$.value.time.day === 2) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-event");
  
      } else if (this._gameState$.value.time.day === 1 && this._gameState$.value.time.tick === 11) {
        // First trigger
        this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-time-strip");
  
      } else if (this._gameState$.value.time.tick === 75) {
        // Newcomers
        if (this._gameState$.value.time.day === 2) this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-newcomers");
  
      } else if (this._gameState$.value.time.tick === 85) {
        // Add new monsters
        if (this._gameState$.value.time.day > 5) this._gameState$.value.windows = this.addMonsters(this._gameState$.value.windows, this._gameState$.value.time.day);
        // Add new battle-field
        if (this._gameState$.value.time.day === 5) {
          this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push("note-event-fight");
          this._gameState$.value.windows.push(new GameWindowBattlefield());
        }
        if (this._gameState$.value.time.day === 6) this._gameState$.value.windows.push(new GameWindowBattlefield());
        if (this._gameState$.value.time.day === 7) this._gameState$.value.windows.push(new GameWindowBattlefield());
  
      } else if (this._gameState$.value.time.tick > 100) {
        // Flame lost and new day
        this.flameLost();
        this.lunchTime();
        this._gameState$.value.time.tick = 0;
        this._gameState$.value.time.day ++;
      }
    }

    this._gameState$.next(this._gameState$.value);
  }

  performTimedActions(): void {
    for (let window of this._gameState$.value.windows) {
      if (window.currentTime !== undefined && window.maxTime) {

        // Add time
        if (window instanceof GameWindowDressing) {
          if (window.content.filter((name) => !this.workerNames.includes(name)).length > 0 && window.content.filter((name) => this.workerNames.includes(name)).length > 0 && !(window.content.includes("unequip-tool") && window.content.filter((name) => "worker".includes(name)).length === 1)) {
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
          if (window.power > 0 && (window.content[0] === "wood" || window.content[0] === "iron-ore" || window.content[0] === "raw-meat" || window.content[0] === "dough")) {
            window.currentTime ++;
            window.power --;
          }

        } else if (window instanceof GameWindowSawmill) {
          if (window.content[0] === "wood" || window.content[0] === "plank") window.currentTime += window.content.filter((name) => name === "worker").length;

        } else if (window instanceof GameWindowField) {
          if (window.currentTime !== 0) window.currentTime ++;
          for (let w = 0; w < window.content.filter((e) => e === "water").length; w++) {
            if (window.currentTime === 0 && window.content.filter((e) => e !== "water").length > 0) window.currentTime = 1;
            else window.currentTime += 10;
          }
          window.content = window.content.filter((e) => e !== "water");

        } else if (window instanceof GameWindowBattlefield) {
          if (window.content.includes("monster-worm") || window.content.includes("monster-dogo") || window.content.includes("monster-spiter")) window.currentTime ++;

        } else if (!(window instanceof GameWindowWorkbench) || (window instanceof GameWindowWorkbench && this.recipesServices.recipeDoable(window.content)[0] !== "nothing")) {
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
            let randomResource: number = this.random(0, 100);
            switch (window.constructor) {
              case GameWindowQuarry:
                if (randomResource < 90) {
                  resourceName = "stone";
                  this.goalService.launchTrigger("gather-stone");
                } else {
                  resourceName = "lizard";
                }
                break;
              case GameWindowScrub:
                if (randomResource < 70) {
                  resourceName = "wood";
                  this.goalService.launchTrigger("gather-wood");
                } else if (randomResource < 85) {
                  resourceName = "fiber";
                  this.goalService.launchTrigger("gather-fiber");
                } else if (randomResource < 95) {
                  resourceName = "millet-seed";
                  this.goalService.launchTrigger("find-seed");
                } else {
                  resourceName = "hare";
                }
                break;
              case GameWindowMine:
                resourceName = "iron-ore";
                this.goalService.launchTrigger("gather-iron-ore");
                break;
              case GameWindowRuin:
                let pRuinN: number = 50;
                let pRuinB: number = 25;
                let pRuinE: number = 20;
                let pRuinS: number = 5;
                let randRuinObj: number = this.random(0, 100);
                if (randRuinObj < pRuinN) {}
                else if (randRuinObj < pRuinN+pRuinB) resourceName = "bread";
                else if (randRuinObj < pRuinN+pRuinB+pRuinE) resourceName = "monster-eye";
                else if (randRuinObj < pRuinN+pRuinB+pRuinE+pRuinS) {
                  resourceName = "millet-seed";
                  this.goalService.launchTrigger("find-seed");
                }
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
            let recipeName: DraggableNames[] | WindowNames = this.recipesServices.recipeDoable(window.content);
            this._gameState$.value.windows[this.indexOfWindow("lighthouse")].content.push(...window.content.filter((name) => name === "worker"));
            window.content = [];
            if (recipeName[0].length > 1) { // Not the "f" of "furnace", but the first element of an array ["bread"]
              for (let res of recipeName) window.content.push(res as DraggableNames);
              this.goalService.launchTrigger("make-"+recipeName[0] as GoalTriggerNames);
            } else {
              if (recipeName === "storage") this._gameState$.value.windows.push(new GameWindowStorage ());
              else if (recipeName === "dressing") this._gameState$.value.windows.push(new GameWindowDressing());
              else if (recipeName === "furnace") this._gameState$.value.windows.push(new GameWindowFurnace());
              else if (recipeName === "sawmill") this._gameState$.value.windows.push(new GameWindowSawmill());
              else if (recipeName === "field") {
                this._gameState$.value.windows.push(new GameWindowField());
                this.goalService.launchTrigger("build-field");
              }
              this.goalService.launchTrigger("build-"+recipeName as GoalTriggerNames);
            }

          } else if (window instanceof GameWindowDressing) {
            let item: DraggableNames = window.content.filter((name) => !this.workerNames.includes(name))[0];
            window.content = window.content.filter((name) => this.workerNames.includes(name));
            let worker: DraggableNames = window.content[0];
            window.content.shift();
            if (item === "unequip-tool") {
              window.content.push("unequip-tool");
              window.content.push("worker");
              switch (worker) {
                case "miner": window.content.push("pickaxe"); break;
                case "fighter": window.content.push("weapon-contact"); break;
                case "archer": window.content.push("weapon-distance"); break;
                case "fighter-reinforced": window.content.push("weapon-contact"); window.content.push("armor"); break;
                case "archer-reinforced": window.content.push("weapon-distance"); window.content.push("armor"); break;
              }
            } else if (item === "pickaxe") {
              window.content.push("miner");
              this.goalService.launchTrigger("equip-miner");
            } else if (item === "weapon-contact") {
              window.content.push("fighter");
              this.goalService.launchTrigger("equip-soldier");
            } else if (item === "weapon-distance") {
              window.content.push("archer");
              this.goalService.launchTrigger("equip-soldier");
            } else if (item === "armor") {
              if (worker === "fighter") window.content.push("fighter-reinforced");
              else if (worker === "archer") window.content.push("archer-reinforced");
              else window.content.push("armor", "worker");
              this.goalService.launchTrigger("equip-reinforcement");
            }

          } else if (window instanceof GameWindowFurnace) {
            if (window.content[0] === "wood" && this.indexOfFirstOpenedStorage("charcoal") !== -1) {
              window.content.shift();
              this._gameState$.value.windows[this.indexOfFirstOpenedStorage("charcoal")].content.push("charcoal");
              this.goalService.launchTrigger("melt-charcoal");
            } else if (window.content[0] === "iron-ore" && this.indexOfFirstOpenedStorage("iron") !== -1) {
              window.content.shift();
              this._gameState$.value.windows[this.indexOfFirstOpenedStorage("iron")].content.push("iron");
              this.goalService.launchTrigger("melt-iron");
            } else if (window.content[0] === "raw-meat" && this.indexOfFirstOpenedStorage("meat") !== -1) {
              window.content.shift();
              this._gameState$.value.windows[this.indexOfFirstOpenedStorage("meat")].content.push("meat");
            } else if (window.content[0] === "dough" && this.indexOfFirstOpenedStorage("bread") !== -1) {
              window.content.shift();
              this._gameState$.value.windows[this.indexOfFirstOpenedStorage("bread")].content.push("bread");
              this.goalService.launchTrigger("melt-bread");
            } else {
              window.currentTime = window.maxTime;
              //this.popupService.pushValue("error", "Pas assez de Stockage pour ce qui sort du Four");
            }

          } else if (window instanceof GameWindowSawmill) {
            let stuffCuted: ResourceNames[] = []
            if (window.content[0] === "wood") stuffCuted = ["plank", "plank", "plank", "plank"];
            else if (window.content[0] === "plank") stuffCuted = ["stick", "stick", "stick", "stick"];
            if (this.indexOfFirstOpenedStorage(stuffCuted[0]) === -1) {
              window.currentTime = window.maxTime;
              //this.popupService.pushValue("error", "Pas de Stockage pour ce qui vient de la Scierie");
            } else {
              window.content.shift();
              for (let i = 0; i < stuffCuted.length; i++) {
                if (this.indexOfFirstOpenedStorage(stuffCuted[i]) !== -1) this._gameState$.value.windows[this.indexOfFirstOpenedStorage(stuffCuted[i])].content.push(stuffCuted[i]);
                else window.content.push(stuffCuted[i]);
              }
            }

          } else if (window instanceof GameWindowField) {
            window.currentTime = 0;
            window.content = window.content.map((e) => e === "millet-seed" ? "millet" : e);
            this.goalService.launchTrigger("gather-millet");

          } else if (window instanceof GameWindowBattlefield) {
            // 1: Long distance attack
            let longDistancePlayerStrength: number = window.content.filter((e) => e === "archer" || e === "archer-reinforced").length;
            let longDistanceEnemyStrength: number = window.content.filter((e) => e === "monster-spiter").length;
            //
            while (longDistancePlayerStrength !== 0) {
              if (window.content.includes("monster-spiter")) window.content.splice(window.content.indexOf("monster-spiter"), 1);
              else if (window.content.includes("monster-worm")) window.content.splice(window.content.indexOf("monster-worm"), 1);
              longDistancePlayerStrength --;
            }
            while (longDistanceEnemyStrength !== 0) {
              if (window.content.includes("archer")) window.content.splice(window.content.indexOf("archer"), 1);
              else if (window.content.includes("archer-reinforced")) window.content[window.content.indexOf("archer-reinforced")] = "archer";
              else this._gameState$.value.flame --;
              longDistanceEnemyStrength --;
            }
            // 2: Speed dogo attack
            let firstStrikeEnemy: number = window.content.filter((e) => e === "monster-dogo").length;
            while (firstStrikeEnemy !== 0) {
              if (window.content.includes("fighter")) window.content.splice(window.content.indexOf("fighter"), 1);
              else if (window.content.includes("fighter-reinforced")) window.content[window.content.indexOf("fighter-reinforced")] = "fighter";
              else this._gameState$.value.flame --;
              firstStrikeEnemy --;
            }
            // 3: Regular attack
            let meleePlayerStrength: number = window.content.filter((e) => e === "fighter" || e === "fighter-reinforced").length * 2;
            let meleeEnemyStrength: number = window.content.filter((e) => e === "monster-worm").length;
            //
            while (meleePlayerStrength !== 0) {
              if (window.content.includes("monster-dogo")) window.content.splice(window.content.indexOf("monster-dogo"), 1);
              else if (window.content.includes("monster-worm")) window.content.splice(window.content.indexOf("monster-worm"), 1);
              meleePlayerStrength --;
            }
            while (meleeEnemyStrength !== 0) {
              if (window.content.includes("fighter")) window.content.splice(window.content.indexOf("fighter"), 1);
              else if (window.content.includes("fighter-reinforced")) window.content[window.content.indexOf("fighter-reinforced")] = "fighter";
              else this._gameState$.value.flame --;
              meleeEnemyStrength --;
            }
            // Check loss
            if (this._gameState$.value.flame <= 0) this.router.navigateByUrl("/end");

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

  emptyPantrySlot(): void {
    const pantryID: number = this.indexOfWindow("pantry");
    if (pantryID === -1) return; // For tuto
    this._gameState$.value.food += this.utils.foodValue(this._gameState$.value.windows[pantryID].slot as DraggableNames[]);
    this._gameState$.value.windows[pantryID].slot = [];
    this._gameState$.next(this._gameState$.value);
  }

  lunchTime(): void {
    this._gameState$.value.food -= this._gameState$.value.people;
    this._gameState$.next(this._gameState$.value);
    if (!this._gameState$.value.isTuto && this._gameState$.value.food < 0) this.router.navigateByUrl("/end");
  }

  countPeople(): void {
    let people: number = 0;
    for (const window of this._gameState$.value.windows) {
      for (const worker of this.workerNames) {
        if (window.content.includes(worker)) people += window.content.filter((e) => e === worker).length;
      }
    }
    this._gameState$.value.people = people;
    this._gameState$.next(this._gameState$.value);
  }

  flameLost(): void {
    this._gameState$.value.flame --;
    this._gameState$.next(this._gameState$.value);
    if (!this._gameState$.value.isTuto && (this._gameState$.value.flame <= 0 || this._gameState$.value.flame >= 100)) this.router.navigateByUrl("/end");
  }

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addMonsters(windows: GameWindow[], day: number): GameWindow[] {
    day -= 5;
    for (const w of windows) {
      if (w.name === "battlefield") {
        w.content.push("monster-worm");
        for (let i = 0; i < day; i++) {
          let rand: number = this.random(0, 100);
          if (rand < 30) w.content.push("monster-worm");
          else if (rand < 80) w.content.push("monster-dogo");
          else w.content.push("monster-spiter");
        }
      }
    }
    return windows;
  }

  testChangeSetup(gsValue: GameState): GameState {
    if (gsValue.isTuto) return gsValue;

    gsValue.time.speed = 0.5;
    gsValue.time.day = 5;
    gsValue.time.tick = 83;
    gsValue.food = 99;
    gsValue.flame = 99;
    gsValue.windows[this.indexOfWindow("lighthouse")].content.push(...["archer" as DraggableNames, "fighter" as DraggableNames, "archer-reinforced" as DraggableNames, "fighter-reinforced" as DraggableNames]);
    return gsValue;
  }

}
