import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { Router } from '@angular/router';
import { GameTime } from '../models/game-time.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState("", "", "", "", 0, new GameTime(0, 0)))

  constructor(private router: Router) { }

  _getGameState$(): Observable<GameState> {
    return this._gameState$.asObservable();
  }

  onDragStart(altNameImage: string, altNameDiv: string): void {
    this._gameState$.value.objectDragged = altNameImage;
    this._gameState$.value.windowStart = altNameDiv;
    console.log(this._gameState$.value)
  }

  onDragEnter(altNameDiv: string): void {
    this._gameState$.value.windowEnd = altNameDiv;
    console.log(this._gameState$.value)
  }

  onDragEnd(): void {
    this._gameState$.value.menuChoice = this._gameState$.value.windowEnd;
    if (this._gameState$.value.windowEnd === "game") {
      this._gameState$.value.menuChoice = "";
      this.router.navigateByUrl("/game");
    }
    this._gameState$.value.windowStart = "";
    this._gameState$.value.windowEnd = "";
    this._gameState$.value.objectDragged = "";
    const newState = this._gameState$.value
    this._gameState$.next(newState)
    console.log(this._gameState$.value)
  }

  tickTime(): void {
    this._gameState$.value.time.tick ++;
    if (this._gameState$.value.time.tick === 5) {
      // Morning environment event
    } else if (this._gameState$.value.time.tick === 75) {
      // Newcomers
    } else if (this._gameState$.value.time.tick === 85) {
      // Attack of the monsters
    } else if (this._gameState$.value.time.tick > 100) {
      // Flame lost and new day
      this.flameLost();
      this._gameState$.value.time.tick = 0;
      this._gameState$.value.time.day ++;
    }
    this._gameState$.next(this._gameState$.value);
  }

  flameLost(): void {
    this._gameState$.value.flame --;
    this._gameState$.next(this._gameState$.value);
  }
}
