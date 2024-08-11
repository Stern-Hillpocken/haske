import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  pawnLastHover: string = "";
  pawnPosition: string = "";

  constructor (private router: Router) {}

  onPawnEnterReceive(divAlt: string): void {
    this.pawnLastHover = divAlt;
  }

  onPawnEndReceive(): void {
    this.pawnPosition = this.pawnLastHover;
    this.pawnLastHover = "";
    if (this.pawnPosition === "game") this.router.navigateByUrl("/game");
  }

}
