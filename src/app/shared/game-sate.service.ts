import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private readonly _gameState$: BehaviorSubject<GameState> = new BehaviorSubject(new GameState("", "", "", ""))

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
}
