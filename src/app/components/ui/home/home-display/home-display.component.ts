import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-display',
  templateUrl: './home-display.component.html',
  styleUrls: ['./home-display.component.scss']
})
export class HomeDisplayComponent {

  @Input()
  typeOfText!: "background" | "credits" | "";

  textToDisplay(): string {
    if (this.typeOfText === "background") return "Background to display";
    else if (this.typeOfText === "credits") return "Credit to display";
    return "...";
  }

}
