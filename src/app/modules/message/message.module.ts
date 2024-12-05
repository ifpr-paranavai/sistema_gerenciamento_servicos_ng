import { NgModule } from '@angular/core';
import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { SharedModule } from "../../core/shared/shared.module";
import { NewContactMessageComponent } from './new-contact-message/new-contact-message.component';
import { DialogModule } from 'primeng/dialog';
import { UsersRequest } from '../../core/requests/users/users.request';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [
        MessageComponent,
        NewContactMessageComponent
    ],
    imports: [
        SharedModule,
        MessageRoutingModule,
        DialogModule,
        DropdownModule,
    ],
    providers: [
        UsersRequest,
    ]
})
export class MessageModule { }
