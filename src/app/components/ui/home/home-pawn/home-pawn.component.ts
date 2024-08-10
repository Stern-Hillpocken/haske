import { Component, Input } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';

@Component({
  selector: 'app-home-pawn',
  templateUrl: './home-pawn.component.html',
  styleUrls: ['./home-pawn.component.scss']
})
export class HomePawnComponent {

  @Input()
  gameState!: GameState;

}
