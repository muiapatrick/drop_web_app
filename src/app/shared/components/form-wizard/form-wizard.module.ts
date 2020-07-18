import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStepComponent } from './wizard-step/wizard-step.component';
import { WizardComponent } from './wizard/wizard.component';
import { AppButtonsModule } from '../app-buttons/app-buttons.module';



@NgModule({
  declarations: [WizardStepComponent, WizardComponent],
  imports: [
    CommonModule,
    AppButtonsModule
  ],
  exports: [WizardStepComponent, WizardComponent]
})
export class FormWizardModule { }
