import { Injectable } from '@angular/core';
import { Trade } from '../models/trade.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { DraggableNames } from '../types/draggable-names.type';

@Injectable({
  providedIn: 'root'
})
export class TradesService {

  _trades$: BehaviorSubject<Trade[]> = new BehaviorSubject<Trade[]>([]);

  allTrades: Trade[] = [
    new Trade("wood", 2, "stone", 1),
    new Trade("stone", 2, "wood", 1),
    new Trade("hare", 1, "fiber", 2),
    new Trade("bread", 3, "worker", 1),
    new Trade("charcoal", 2, "bread", 1),
    new Trade("iron", 2, "millet-seed", 1),
    new Trade("skin", 3, "water", 1)
  ];

  oldTradeNumber: number = -1;

  constructor() {}

  _getTrades$(): Observable<Trade[]> {
    return this._trades$.asObservable();
  }

  newTrader(): void {
    let currentTrades: Trade[] = [];
    for (let i = 0; i < 2; i ++) {
      let randomTrade: number = Math.floor(Math.random() * this.allTrades.length);
      while (this.oldTradeNumber === randomTrade) {
        randomTrade = Math.floor(Math.random() * this.allTrades.length);
      }
      this.oldTradeNumber = randomTrade;
      currentTrades.push(this.allTrades[randomTrade]);
    }
    this._trades$.next(currentTrades);
  }

  tradeCheckAndPerform(slot: DraggableNames[]): DraggableNames[] {
    for (const trade of this._trades$.value) {
      if (slot.filter(e => e === trade.wantName).length >= trade.wantQuantity) {
        // Delete want-element
        slot = slot.filter(e => e != trade.wantName);
        // Add give-element
        for (let i = 0; i < trade.giveQuantity; i++) slot.push(trade.giveName);
      }
    }
    return slot;
  }

}
