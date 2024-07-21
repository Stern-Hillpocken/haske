import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  typeOfTextToDiplay: "background" | "credits" | "" = "";
  lastOver: string = "";

  constructor (private router: Router) {}

  onPawnOverReceive(menuAlt: string): void {
    this.lastOver = menuAlt;
  }

  onPawnDragEndReceive(pawn: string): void {
    console.log(pawn + " > " + this.lastOver)
    if (this.lastOver === "game") this.router.navigateByUrl("/game");
    else if (this.lastOver === "background" || this.lastOver === "credits" || this.lastOver === "") this.typeOfTextToDiplay = this.lastOver;
    else this.typeOfTextToDiplay = "";
  }

  onDivEnter(): void {
    //this.lastOver = ""
    console.log("div enter")
  }
}
