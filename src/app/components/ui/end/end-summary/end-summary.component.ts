import { Component, Input } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';

@Component({
  selector: 'app-end-summary',
  templateUrl: './end-summary.component.html',
  styleUrls: ['./end-summary.component.scss']
})
export class EndSummaryComponent {

  @Input()
  gameState!: GameState;

}
