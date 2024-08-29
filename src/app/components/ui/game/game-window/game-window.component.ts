import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameWindow, GameWindowRecipesBook } from 'src/app/models/game-window.model';
import { RecipesService } from 'src/app/shared/recipes.service';
import { DraggableNames } from 'src/app/types/draggable-names.type';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.scss']
})
export class GameWindowComponent {

  @Input()
  allWindows!: GameWindow[];

  @Input()
  currentDragName!: DraggableNames;

  @Input()
  windowInfo!: GameWindow;

  @Input()
  id!: number;

  @Output()
  draggableEnterEmitter: EventEmitter<number> = new EventEmitter();

  layerX: number = 0;
  layerY: number = 0;

  constructor(private recipesService: RecipesService) {}

  getTitle(): string {
    switch (this.windowInfo.name) {
      case "exploration": return "Exploration";
      case "lighthouse": return "Phare";
      case "storage": return "Entrepôt";
      case "quarry": return "Carrière";
      case "scrub": return "Broussailles";
      case "workbench": return "Atelier";
      case "trash": return "Rebut";
      case "help": return "?";
      case "dressing": return "Vestiaire";
      case "recipes-book": return "Recettes";
    }
  }

  storageId(): number {
    let currentStorageId: number = 1;
    for (let i = 0; i < this.id; i++) {
      if (this.allWindows[i].name === "storage") currentStorageId++;
    }
    return currentStorageId;
  }

  onDragEnter(): void {
    this.draggableEnterEmitter.emit(this.id);
  }

  onDragEnterSlot(): void {
    this.draggableEnterEmitter.emit(this.id+0.5);
  }

  onWindowDragStart(event: any): void {
    this.layerX = event.layerX;
    this.layerY = event.layerY;
  }

  onWindowDragEnd(event: DragEvent): void {
    const div: HTMLDivElement = event.target as HTMLDivElement;
    div.style.left = event.clientX - this.layerX + div.offsetWidth/2 + "px";
    div.style.top = event.clientY - this.layerY + "px";
    let maxZ = 0;
    for(let i = 0; i < document.getElementsByClassName("window-box").length; i++) {
      let checkingZ: number = parseInt((document.getElementsByClassName("window-box")[i] as HTMLDivElement).style.zIndex);
      if(checkingZ > maxZ) maxZ = checkingZ;
    }
    div.style.zIndex = (maxZ + 1).toString();
  }

  isDropableHere(): boolean {
    if (this.currentDragName === "nothing") return true;
    if (this.windowInfo.acceptance.includes(this.currentDragName)) return true;
    return false;
  }

  helpDisplay(): string {
    if (!this.windowInfo.slot) return "";
    switch (this.windowInfo.slot[0]) {
      case "nothing": return "";
      case "pawn": return "";
      // Workers
      case "worker": return "Une main d’oeuvre pour faire ce que vous désirez.";
      case "miner": return "Un aikaci spécialisé pour aller dans la mine.";
      // Resources
      case "stone": return "De la pierre pour construire.";
      case "water": return "De l’eau pour survivre et allumer le phare.";
      case "wood": return "Du bois pour construire.";
      // Notes
      case "note-help-and-trash": return "Ici c’est l’endroit pour avoir des informations sur les différents élèments. Pour l’instant un élement de type \"note\" est dans l’emplacement mais tu peux l’enlever pour libérer la place pour un autre. Tu peux par exemple détruire cette note en la plaçant dans le Rebut.";
      case "note-time-strip": return "En haut se trouve la frise du temps avec différents évènements qui y sont associés, et le temps qui passe.";
      case "note-storage-filter": return "Tu peux associer un ou plusieurs élèments à un Entrepôt pour que seulement ces élèments puissent être stockés à l’intérieur.";
      case "note-event-end-day": return "À la fin de la journée il faut nourrir tes aikacis, sans quoi ils et elles mourront. Et la flamme du phare diminuera d’un cran.";
      case "note-event-event": return "Tous les matins tu auras un nouvel évènement à t’occuper.";
      case "note-event-fight": return "Durant le nuit les halittus attaqueront de différents côtés, en fonction de la puissance de la puissance de ton phare. Prépare de défenses et dispose des guerriers.";
      case "note-event-newcomers": return "En fonction de la puissance de feu de ton phare, des gens viendront te rejoindre. Mais cela impact aussi le nombre de personnes à nourrir.";
      // Items
      case "pickaxe": return "Un outil qui peut être équipé à un aikaci dans un Vestiaire, permettant d’exploiter les mines.";
    }
  }

  recipesBookDisplay(): string {
    if (!(this.windowInfo instanceof GameWindowRecipesBook)) return "error";
    return this.recipesService.recipesWith(this.windowInfo.slot[0]);
  }

  workbenchPreparedRecipe(): string {
    if (this.windowInfo.name === "workbench" && this.exactRecipe() !== "nothing") return "assets/images/draggable/" + this.exactRecipe() + ".png";
    return "assets/images/window/" + this.windowInfo.name + ".png";
  }

  exactRecipe(): DraggableNames {
    return this.recipesService.recipeDoable(this.windowInfo.content);
  }

  contentLengthWithoutWorker(): number {
    return this.windowInfo.content.filter((name) => name !== "worker").length
  }

}
