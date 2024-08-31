import { Component } from '@angular/core';
import { GameState } from 'src/app/models/game-state.model';
import { GameStateService } from 'src/app/shared/game-sate.service';
import { GoalService } from 'src/app/shared/goal.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  gameState!: GameState;

  currentGoal!: string;

  constructor (private gss: GameStateService, private goalService: GoalService) {
    this.gss._getGameState$().subscribe((gs: GameState) => {
      this.gameState = gs;
    });
    this.goalService._getGoal$().subscribe((goal: string) => {
      this.currentGoal = goal;
    });
  }

  onTickReceive(): void {
    this.gss.tickTime();
  }

  onDraggableEnterReceive(windowId: number): void {
    this.gss.onDragEnter(windowId);
  }

}
