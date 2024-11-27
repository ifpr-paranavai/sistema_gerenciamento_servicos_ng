import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para two-way binding
import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';

@NgModule({
  declarations: [MessageComponent], // Declare o componente Message
  imports: [
    CommonModule,
    FormsModule, // Import FormsModule para suporte a [(ngModel)]
    MessageRoutingModule
  ]
})
export class MessageModule {}
