import { NgModule } from '@angular/core';
import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { SharedModule } from "../../core/shared/shared.module";

@NgModule({
  declarations: [MessageComponent],
  imports: [
    SharedModule,
    MessageRoutingModule
  ]
})
export class MessageModule {}
