import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameState } from 'src/app/models/game-state.model';
import { GameStateService } from 'src/app/shared/game-sate.service';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndComponent {

  gameState!: GameState;

  constructor (private router: Router, private gss: GameStateService) {
    this.gss._getGameState$().subscribe((gs) => {
      this.gameState = gs;
    });
  }

  onDragEndReceive(label: "menu" | "tuto" | "game"): void {
    this.gss.init(label === "tuto");
    if (label === "menu") this.router.navigateByUrl("/");
    else this.router.navigateByUrl("/game");
  }

}
