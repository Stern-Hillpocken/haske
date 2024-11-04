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
    if (this.pawnPosition === "background") return "Une zone est à l’abandon car le phare n’émet plus de lumière. Ravive sa flamme à temps pour éloigner les créatures et vivre paisiblement.";
    else if (this.pawnPosition === "credits") return "Stern-Hillpocken (sur github)";
    return "Savais-tu que tu pouvais déplacer les menus ? Le déplacement d'élements est même le cœur du jeu. C’est ainsi que tu vas pouvoir réorganiser ton espace de jeu mais surtout déplacer les différents ouvriers (appelés aikacis) et objets que tu obtiendras.";
  }

}
