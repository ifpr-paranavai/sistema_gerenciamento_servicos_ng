// review.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

// Components
import { ReviewComponent } from './review.component';

@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    // Angular Core Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // PrimeNG Modules
    RatingModule,
    DialogModule,
    ButtonModule,
    InputTextareaModule
  ],
  exports: [
    ReviewComponent
  ]
})
export class ReviewModule { }