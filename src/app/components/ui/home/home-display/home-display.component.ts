import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-display',
  templateUrl: './home-display.component.html',
  styleUrls: ['./home-display.component.scss']
})
export class HomeDisplayComponent {

  @Input()
  pawnPosition!: string;

  textToDisplay(): string {
    if (this.pawnPosition === "background") return "Background to display";
    else if (this.pawnPosition === "credits") return "Credit to display";
    return "Savais-tu que tu pouvais déplacer les menus ? Le déplacement d'élements est même le cœur du jeu. C’est ainsi que tu vas pouvoir réorganiser ton espace de jeu mais surtout déplacer les différents ouvriers (appelés aikacis) et objets que tu obtiendras.";
  }

}
