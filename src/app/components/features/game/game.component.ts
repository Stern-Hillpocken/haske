import { Component } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';
import { GameStateService } from 'src/app/shared/game-sate.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  gameState!: GameState;

  constructor (private gss: GameStateService) {
    this.gss._getGameState$().subscribe((gs: GameState) => {
      this.gameState = gs;
    })
  }

  onTickReceive(): void {
    this.gss.tickTime();
  }

}
