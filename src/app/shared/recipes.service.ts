import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { DraggableNames } from '../types/draggable-names.type';
import { ResourceNames } from '../types/resource-names.type';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  allReceipes: Recipe[] = [
    new Recipe("pickaxe", ["stone", "wood"], [1, 1], 12)
  ];

  constructor() { }

  getAllRecipes(): Recipe[] {
    return this.allReceipes;
  }

  recipeDoable(content: DraggableNames[]): DraggableNames {
    for (let r = 0; r < this.allReceipes.length; r++) {
      let valid: number = 0;
      for (let i = 0; i < this.allReceipes[r].resources.length; i++) {
        if (content.filter((name) => name === this.allReceipes[r].resources[i]).length === this.allReceipes[r].quantity[i]) valid ++;
      }
      if (valid === this.allReceipes[r].resources.length) return this.allReceipes[r].name;
    }
    return "nothing";
  }

  recipesWith(resource: ResourceNames): string {
    let recipes: string = "";
    for (let recipe of this.allReceipes) {
      let sentence: string = "";
      let isIn: boolean = false;
      for (let i = 0; i < recipe.resources.length; i++) {
        sentence += "<img src='assets/images/draggable/" + recipe.resources[i] + ".png'>";
        if (i < recipe.resources.length-1) sentence += " + ";
        if (i === recipe.resources.length-1) sentence += " = <img src='assets/images/draggable/" + recipe.name + ".png'><br>";
        if (recipe.resources[i] === resource) isIn = true;
      }
      if (isIn) recipes += sentence;
    }
    return recipes === "" ? "Pas de recette avec cet élèment..." : recipes;
  }

}
