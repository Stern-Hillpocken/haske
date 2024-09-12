import { Injectable } from '@angular/core';
import { DraggableNames } from '../types/draggable-names.type';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  foodValue(foodList: DraggableNames[]): number {
    let total: number = 0;
    for(const food of foodList) {
      switch (food) {
        case "bread": total += 3; break;
        case "monster-eye": total += 0.5; break;
      }
    }
    return total;
  }
  
}
