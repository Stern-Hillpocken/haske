import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { DraggableNames } from '../types/draggable-names.type';

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
}
