import { Component } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';
import { GameStateService } from 'src/app/shared/game-sate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  gameState!: GameState;
  typeOfTextToDiplay!: string;

  constructor (private gss: GameStateService) {
    this.gss._getGameState$().subscribe((gs: GameState) => {
      this.gameState = gs;
      this.typeOfTextToDiplay = gs.menuChoice;
    })
  }

  onPawnEnterReceive(menuAlt: string): void {
    this.gss.onDragEnter(menuAlt);
  }

}
