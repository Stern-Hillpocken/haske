import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-banner',
  templateUrl: './time-banner.component.html',
  styleUrls: ['./time-banner.component.scss']
})
export class TimeBannerComponent {

  @Input()
  tick!: number;

  @Input()
  speed!: number;

  title: string = "";
  content: string = "";

  isTimeEvent(): boolean {
    if ([5, 6, 7, 8, 9].includes(this.tick)) {
      this.title = "Évènement environemental";
      this.content = "Un nouvel évènement vient d’arriver";
      return true;
    } else if ([75, 76, 77, 78, 79].includes(this.tick)) {
      this.title = "Nouveaux et nouvelles arrivantes";
      this.content = "Des personnes sont arrivées dans le phare";
      return true;
    } else if ([85, 86, 87, 88, 89].includes(this.tick)) {
      this.title = "Attaque des créatures";
      this.content = "Si tu ne les gères pas elles éteindront le phare";
      return true;
    } else if ([100, 0, 1, 2, 3].includes(this.tick)) {
      this.title = "La flamme diminue";
      this.content = "Le phare perd 1 de lueur";
      return true;
    }
    return false;
  }

}
