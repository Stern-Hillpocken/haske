import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoalTriggerNames } from '../types/goal-trigger-names.type';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  _goal$: BehaviorSubject<string> = new BehaviorSubject("");
  currentStep: number = -1;
  isCurrentSubStepsValidated: boolean[] = [];
  allSubSteps: string[][] = [
    ["Découverte du monde et de ses ressources", "Envoyer un aikaci en exploration", "Récupérer de la pierre dans une Carrière", "Récupérer du bois dans les Broussailles", "Trouver de la fibre dans les Broussailles"],
    ["Un endroit pour se vêtir", "Tisser un tissu à partir de fibres dans l’Atelier", "Dégrossir du bois en planche dans l’Atelier", "Construire un Vestiaire"],
    ["Retour au début de l’âge de fer", "Fabriquer une pioche dans l’Atelier", "Équiper un aikaci avec la pioche dans le Vestiaire", "Miner du minerai de fer dans une Mine"],
    ["Une meilleure découpe du bois", "Construire un Four", "Y faire fondre un minerai de fer", "Construire une Scierie", "Construire un Stockage"],
    
    ["Allumer le Phare !", "Avoir 100 de luminosité dans le Phare"]
  ]

  constructor() {
    this.addStep();
    this._goal$.next(this.formattingDisplay());
  }

  _getGoal$(): Observable<string> {
    return this._goal$.asObservable();
  }

  addStep(): void {
    this.currentStep ++;
    this.isCurrentSubStepsValidated = [true];
    for (let i = 1; i < this.allSubSteps[this.currentStep].length; i++) {
      this.isCurrentSubStepsValidated.push(false);
    }
  }

  launchTrigger(trigger: GoalTriggerNames): void {
    if (this.currentStep === 0) {
      // 0 - Explore && Gather resources: wood, stone, fiber
      if (trigger === "exporation") this.isCurrentSubStepsValidated[1] = true;
      if (trigger === "gather-stone") this.isCurrentSubStepsValidated[2] = true;
      if (trigger === "gather-wood") this.isCurrentSubStepsValidated[3] = true;
      if (trigger === "gather-fiber") this.isCurrentSubStepsValidated[4] = true;
    } else if (this.currentStep === 1) {
      if (trigger === "make-fabric") this.isCurrentSubStepsValidated[1] = true;
      if (trigger === "make-plank") this.isCurrentSubStepsValidated[2] = true;
      if (trigger === "build-dressing") this.isCurrentSubStepsValidated[3] = true;
    } else if (this.currentStep === 2) {
      // 2 - Pickaxe && Dressing && Miner
      if (trigger === "make-pickaxe") this.isCurrentSubStepsValidated[1] = true;
      if (trigger === "equip-miner") this.isCurrentSubStepsValidated[2] = true;
      if (trigger === "gather-iron-ore") this.isCurrentSubStepsValidated[3] = true;
    } else if (this.currentStep === 3) {
      // 3 - Furnace && Sawmill && Storage
      if (trigger === "build-furnace") this.isCurrentSubStepsValidated[1] = true;
      if (trigger === "melt-iron") this.isCurrentSubStepsValidated[2] = true;
      if (trigger === "build-sawmill") this.isCurrentSubStepsValidated[3] = true;
      if (trigger === "build-storage") this.isCurrentSubStepsValidated[4] = true;
    } else if (this.currentStep === 4) {
      // 4 - Equip a aikaci to have soldier
    } else if (this.currentStep === 5) {
      // 5 - Perform your first sacrifice
    } else {
      // Light the lighthouse with 100 fire
    }
    if (this.isCurrentSubStepsValidated.filter(val => val === true).length === this.isCurrentSubStepsValidated.length) this.addStep();
    this._goal$.next(this.formattingDisplay());
  }

  formattingDisplay(): string {
    let concatedString: string = "<h4>" + this.allSubSteps[this.currentStep][0] + "</h4><ul>";
    for (let i = 1; i < this.isCurrentSubStepsValidated.length; i++) {
      if (this.isCurrentSubStepsValidated[i] === true) concatedString += "<li class='goal-validated'>";
      else concatedString += "<li>";
      concatedString += this.allSubSteps[this.currentStep][i] + "</li>";
    }
    concatedString += "</ul>";
    return concatedString;
  }

}
