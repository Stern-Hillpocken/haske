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
    new Recipe(["pickaxe"], ["stone", "stick"], [1, 2], 12),
    new Recipe(["weapon-contact"], ["stick", "iron"], [4, 1], 12),
    new Recipe(["weapon-distance"], ["stick", "iron", "fiber"], [3, 1, 1], 12),
    new Recipe(["armor"], ["iron", "fiber"], [3, 2], 12),

    new Recipe(["plank", "plank"], ["wood"], [1], 8),
    new Recipe(["stick", "stick"], ["plank"], [1], 8),
    new Recipe(["fabric"], ["fiber"], [3], 8),

    new Recipe(["millet-seed", "millet-seed"], ["millet"], [1], 4),
    new Recipe(["flour"], ["millet"], [3], 6),
    new Recipe(["dough"], ["flour", "water"], [1, 1], 4),
    new Recipe(["dough", "dough"], ["flour", "water"], [2, 1], 5),
    new Recipe(["dough", "dough", "dough"], ["flour", "water"], [3, 1], 6),
    new Recipe(["dough", "dough", "dough", "dough"], ["flour", "water"], [4, 1], 7),
    new Recipe(["dough", "dough", "dough", "dough", "dough"], ["flour", "water"], [5, 1], 8),
    new Recipe(["dough", "dough", "dough", "dough", "dough", "dough"], ["flour", "water"], [6, 1], 9),
    new Recipe(["dough", "dough", "dough", "dough", "dough", "dough", "dough"], ["flour", "water"], [7, 1], 10),
    new Recipe(["raw-meat", "skin"], ["hare"], [1], 6),
    new Recipe(["raw-meat"], ["lizard"], [1], 6),

    new Recipe("storage", ["wood", "plank"], [4, 4], 12),
    new Recipe("dressing", ["fabric", "wood", "plank"], [1, 2, 2], 12),
    new Recipe("furnace", ["stone"], [8], 16),
    new Recipe("sawmill", ["iron", "wood", "plank"], [3, 2, 3], 16),
    new Recipe("field", ["wood", "fiber"], [4, 2], 10)
  ];

  constructor() { }

  getAllRecipes(): Recipe[] {
    return this.allReceipes;
  }

  recipeDoable(content: DraggableNames[]): DraggableNames[] | WindowNames {
    for (let r = 0; r < this.allReceipes.length; r++) {
      let valid: number = 0;
      for (let i = 0; i < this.allReceipes[r].resources.length; i++) {
        if (content.filter((name) => name === this.allReceipes[r].resources[i]).length === this.allReceipes[r].quantity[i]) valid ++;
      }
      let sumOfQuantity: number = this.allReceipes[r].quantity.reduce((partialSum, a) => partialSum + a, 0);
      let contentWithoutWorker: number = content.filter((e) => !e.includes("worker")).length;
      if (valid === this.allReceipes[r].resources.length && contentWithoutWorker === sumOfQuantity) return this.allReceipes[r].name;
    }
    return ["nothing"];
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
        if (i === recipe.resources.length-1) {
          sentence += "<span class='math-sign'> = </span>";
          if (typeof recipe.name === "string") {
            sentence += "<img src='assets/images/draggable/" + recipe.name + ".png'>";
          } else {
            for (let res of recipe.name) sentence += "<img src='assets/images/draggable/" + res + ".png'>";
          }
          sentence += "<br>";
        }
        if (recipe.resources[i] === resource) isIn = true;
      }
      if (isIn) recipes += sentence;
    }
    return recipes === "" ? "Pas de recette avec cet élèment..." : recipes;
  }

}
