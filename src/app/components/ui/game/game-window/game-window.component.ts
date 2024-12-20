import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameWindow, GameWindowHelp, GameWindowRecipesBook } from 'src/app/models/game-window.model';
import { Trade } from 'src/app/models/trade.model';
import { RecipesService } from 'src/app/shared/recipes.service';
import { DraggableNames } from 'src/app/types/draggable-names.type';
import { WindowNames } from 'src/app/types/window-names.type';

@Component({
  selector: 'app-game-window',
  templateUrl: './game-window.component.html',
  styleUrls: ['./game-window.component.scss']
})
export class GameWindowComponent {

  @Input()
  currentGoal!: string;

  @Input()
  allWindows!: GameWindow[];

  @Input()
  currentDragName!: DraggableNames;

  @Input()
  windowInfo!: GameWindow;

  @Input()
  id!: number;

  @Input()
  flame!: number;

  @Input()
  food!: number;

  @Input()
  people!: number;

  @Input()
  trades!: Trade[];

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
      case "mine": return "Mine";
      case "goal": return "Objectif";
      case "pantry": return "Garde-manger";
      case "ruin": return "Ruine";
      case "furnace": return "Four";
      case "sawmill": return "Scierie";
      case "field": return "Champs";
      case "battlefield": return "Champs de bataille";
      case "siper": return "Siropteur";
      case "trader": return "Marchand";
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
      case "mana": return "La mana, une substance vitale utilisée pour augmenter l’éclat du Phare.";
      // Workers
      case "worker": return "Une main d’oeuvre pour faire ce que vous désirez.";
      case "miner": return "Un ou une aikaci spécialisée pour aller dans la mine.";
      case "fighter": return "Un ou une combattante rôdée à la force de la mêlée, qui offrira sa vie pour défendre le lieu.";
      case "fighter-reinforced": return "Une personne renforcée qui pourra supporter une attaque.";
      case "archer": return "Un ou une combatante rôdée à la précision de distance, qui offrira sa vie pour défendre le lieu.";
      case "archer-reinforced": return "Une personne renforcée qui pourra supporter une attaque.";
      // Resources
      case "stone": return "De la pierre pour construire.";
      case "water": return "De l’eau pour survivre et allumer le phare.";
      case "wood": return "Du bois pour construire ou pour être transformé en charbon ou planche.";
      case "charcoal": return "Du charbon de bois pour le Four.";
      case "plank": return "Une planche de bois utile pour faire des tiges."
      case "stick": return "Tige de bois.";
      case "fiber": return "Une fibre extraite des végétaux, utile pour faire du tissu.";
      case "fabric": return "Du tissu, très rustique.";
      case "iron-ore": return "Un minerai de fer qu’il va falloir faire fondre dans le Four pour être utilisé.";
      case "lizard": return "Un lézard des rochers, qui peut être relâché dans le Rebus ou dépecé dans l’Atelier.";
      case "hare": return "Un lièvre des sables, qui peut être relâché dans le Rebus ou dépecé dans l’Atelier.";
      case "raw-meat": return "Viande cru, à mettre au Four.";
      case "skin": return "De la peau d’animal.";
      case "iron": return "Un lingot de fer.";
      case "millet-seed": return "Une graine de mil (ou millet) utilisée dans les Champs.";
      case "millet": return "Du mil (ou millet), comme du blé mais pour les zones sèches. Sa farine peut être utilisée pour faire des galettes.";
      case "flour": return "Farine, utilisée pour faire des galettes, du pain.";
      case "dough": return "Une pâte prête à être cuite."
      // Monster
      case "monster-worm": return "NO";
      case "monster-dogo": return "NO";
      case "monster-spiter": return "NO";
      // Monster parts
      case "monster-eye": return "Un œil qui peut être utilisé pour ne plus voir les objectifs.";
      // Food
      case "bread": return "Du pain à donner à manger à un aikaci.";
      case "meat": return "De la viande consommable ou à utiliser en recette.";
      // Misc
      case "unequip-tool": return "Un objet pour permettre de d’enlever l’équipement de tes aikacis dans le Vestiaire.";
      // Notes
      case "note-help-and-trash": return "Ici c’est l’endroit pour avoir des informations sur les différents élèments. Pour l’instant un élement de type \"note\" (représenté par l’enveloppe) est dans l’emplacement mais tu peux l’enlever pour libérer la place pour un autre élèment. Tu peux par exemple détruire cette note en la plaçant dans le Rebut. Chaque note est différente, examine les toutes !";
      case "note-time-strip": return "En haut se trouve la frise du temps avec différents évènements qui y sont associés, et le temps qui passe.";
      case "note-storage-filter": return "Tu peux associer un ou plusieurs élèments dans le haut d’un Entrepôt pour que seulement ces élèments puissent être stockés à l’intérieur.";
      case "note-event-end-day": return "À la fin de la journée il faut nourrir tes aikacis en ayant au préalable mis de la nourriture dans le Garde-Manger, sans quoi ils et elles mourront. Pour avoir de la nourriture tu peux trouver des lézards (à dépecer puis cuire) dans les Carrières, des lièvres dans les Broussailles, ou des graines à mettre dans un Champs (avec de l'eau). En plus de la nourriture, la flamme du phare diminue d’un cran à chaque fin de journée.";
      case "note-event-event": return "Tous les matins tu auras un nouvel évènement à t’occuper.";
      case "note-event-fight": return "Durant la nuit les halittus attaqueront de différents côtés, en fonction de la puissance de la puissance de ton phare. Prépare de défenses et dispose des guerriers.";
      case "note-event-newcomers": return "En fonction de la puissance de feu (palier de 10 + 1) de ton phare, des gens viendront te rejoindre. Mais cela impact aussi le nombre de personnes à nourrir.";
      case "note-exploration-x-time": return "Chaque lieu exploré peut l’être un certain nombre de fois, rappelé à droite par le x1, x2, x3, etc...";
      case "note-fight": return "Le combat se déroule de manière complexe mais précise. Les attaques à distances de deux camps (allié et ennemi) se déroulent. Le camp allié va attaquer en premier les monstres attaquant à distance, puis ceux au corps-à-corps (mais pas ceux qui sont trop rapide). Le camp ennemi ennemi va attaquer les aikacis attaquant à distance puis la flamme si il n’y a plus personne. Puis les ennemis qui sont rapides attaque les aikacis étant au corps-à-corps ou à défaut la flamme. Puis enfin les corps-à-corps s’attaquent mutuellement.";
      case "note-trader": return "En début de journée un Marchand apparaît. Tu as jusqu’en début de soirée pour commercer.";
      // Items
      case "pickaxe": return "Un outil qui peut être équipé à un aikaci dans un Vestiaire, permettant d’exploiter les mines.";
      case "weapon-contact": return "Une arme de mêlée facilement utilisable à une ou deux mains.";
      case "weapon-distance": return "Une arme à distance pour que vos aikacis ne soient jamais blessés.";
      case "armor": return "Une armure pour défendre un combatant ou combatante lors des confrontations sur le champs de bataille.";
    }
  }

  recipesBookDisplay(): string {
    if (!(this.windowInfo instanceof GameWindowRecipesBook)) return "error";
    return this.recipesService.recipesWith(this.windowInfo.slot[0]);
  }

  workbenchPreparedRecipe(): string[] {
    let xRecipe = this.exactRecipe();
    if (this.windowInfo.name === "workbench" && xRecipe[0] !== "nothing") {
      let ret: string[] = [];
      if (typeof xRecipe === "string") return ["assets/images/draggable/" + xRecipe + ".png"];
      for (let res of xRecipe) {
        ret.push("assets/images/draggable/" + res + ".png");
      }
      return ret;
    } /*else if (this.windowInfo.name === "lighthouse") {
      return ["assets/images/window/" + this.windowInfo.name + ".png"];
    }*/
    return [];
  }

  exactRecipe(): DraggableNames[] | WindowNames {
    return this.recipesService.recipeDoable(this.windowInfo.content);
  }

  contentLengthWithoutWorker(): number {
    return this.windowInfo.content.filter((name) => !["worker", "miner", "fighter", "figther-reinforced", "archer", "archer-reinforced"].includes(name)).length;
  }

  classOfTitle(): string {
    let style!: "basic" | "exploration" | "food" | "storage" | "workstation" | "warning" | "battle";
    switch (this.windowInfo.name) {
      case "dressing": style = "workstation"; break;
      case "exploration": style = "exploration"; break;
      case "goal": style = "basic"; break;
      case "help": style = "basic"; break;
      case "lighthouse": style = "basic"; break;
      case "mine": style = "exploration"; break;
      case "pantry":
        if(this.food >= this.people) {style = "food"; break;}
        else {style = "warning"; break;}
      case "quarry": style = "exploration"; break;
      case "recipes-book": style = "basic"; break;
      case "scrub": style = "exploration"; break;
      case "storage": style = "storage"; break;
      case "trash": style = "basic"; break;
      case "workbench": style = "workstation"; break;
      case "ruin": style = "exploration"; break;
      case "furnace": style = "workstation"; break;
      case "sawmill": style = "workstation"; break;
      case "field": style = "food"; break;
      case "battlefield": style = "battle"; break;
    }
    return style;
  }

  displayProgressBar(): boolean {
    return this.windowInfo.currentTime !== undefined
      && this.windowInfo.maxTime !== undefined
      && (this.windowInfo.content.includes('worker')
        || this.windowInfo.content.includes('miner')
        || this.windowInfo.content.includes('fighter')
        || this.windowInfo.content.includes('fighter-reinforced')
        || this.windowInfo.content.includes('archer')
        || this.windowInfo.content.includes('archer-reinforced')
        || (this.windowInfo.name === 'furnace' && this.windowInfo.currentTime > 0)
        || (this.windowInfo.name === 'field' && this.windowInfo.currentTime > 0)
        || (this.windowInfo.name === 'battlefield' && this.windowInfo.content.length > 0)
        || (this.windowInfo.name === 'siper' && this.windowInfo.content.length > 0)
      );
  }

  progressBarWidth(): number {
    if (!this.windowInfo.currentTime || !this.windowInfo.maxTime) return 0;
    return this.windowInfo.currentTime*100/this.windowInfo.maxTime;
  }

  tradesDisplay(): string {
    let dispay: string = "";
    for (const trade of this.trades) {
      trade.wantQuantity > 1 ? dispay += trade.wantQuantity + "x " : "";
      dispay += "<img src='assets/images/draggable/" + trade.wantName + ".png'> <span class='math-sign'>--></span> ";
      trade.giveQuantity > 1 ? dispay += trade.giveQuantity + "x ": "";
      dispay += "<img src='assets/images/draggable/" + trade.giveName + ".png'><br>";
    }
    return dispay;
  }

}
