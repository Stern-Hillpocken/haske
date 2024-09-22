import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from 'src/app/shared/game-sate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  pawnLastHover: string = "";
  pawnPosition: string = "";

  constructor (private router: Router, private gss: GameStateService) {}

  onPawnEnterReceive(divAlt: string): void {
    this.pawnLastHover = divAlt;
  }

  onPawnEndReceive(): void {
    this.pawnPosition = this.pawnLastHover;
    this.pawnLastHover = "";
    if (this.pawnPosition === "tuto" || this.pawnPosition === "game") {
      this.gss.init(this.pawnPosition === "tuto");
      this.router.navigateByUrl("/game");
    }
  }

}
