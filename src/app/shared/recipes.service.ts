import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { DraggableNames } from '../types/draggable-names.type';
import { ResourceNames } from '../types/resource-names.type';
import { WindowNames } from '../types/window-names.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  allReceipes: Recipe[] = [
    new Recipe("pickaxe", ["stone", "wood"], [1, 1], 12),

    new Recipe("plank", ["wood"], [1], 8),
    new Recipe("stick", ["plank"], [1], 8),
    new Recipe("fabric", ["fiber"], [3], 8),

    new Recipe("storage", ["wood", "plank"], [4, 4], 12),
    new Recipe("dressing", ["fabric", "wood", "plank"], [1, 2, 2], 12),
    new Recipe("furnace", ["stone"], [8], 16),
    new Recipe("sawmill", ["iron", "wood", "plank"], [3, 2, 3], 16)
  ];

  constructor() { }

  getAllRecipes(): Recipe[] {
    return this.allReceipes;
  }

  recipeDoable(content: DraggableNames[]): DraggableNames | WindowNames {
    for (let r = 0; r < this.allReceipes.length; r++) {
      let valid: number = 0;
      for (let i = 0; i < this.allReceipes[r].resources.length; i++) {
        if (content.filter((name) => name === this.allReceipes[r].resources[i]).length === this.allReceipes[r].quantity[i]) valid ++;
      }
      let sumOfQuantity: number = this.allReceipes[r].quantity.reduce((partialSum, a) => partialSum + a, 0);
      let contentWithoutWorker: number = content.filter((e) => !e.includes("worker")).length;
      if (valid === this.allReceipes[r].resources.length && contentWithoutWorker === sumOfQuantity) return this.allReceipes[r].name;
    }
    return "nothing";
  }

  recipesWith(resource: ResourceNames): string {
    let recipes: string = "";
    for (let recipe of this.allReceipes) {
      let sentence: string = "";
      let isIn: boolean = false;
      for (let i = 0; i < recipe.resources.length; i++) {
        let timesNeeded: string = recipe.quantity[i] > 1 ? recipe.quantity[i]+"x" : "";
        sentence += timesNeeded + "<img src='assets/images/draggable/" + recipe.resources[i] + ".png'>";
        if (i < recipe.resources.length-1) sentence += "<span class='math-sign'> + </span>";
        if (i === recipe.resources.length-1) sentence += "<span class='math-sign'> = </span><img src='assets/images/draggable/" + recipe.name + ".png'><br>";
        if (recipe.resources[i] === resource) isIn = true;
      }
      if (isIn) recipes += sentence;
    }
    return recipes === "" ? "Pas de recette avec cet élèment..." : recipes;
  }

}
