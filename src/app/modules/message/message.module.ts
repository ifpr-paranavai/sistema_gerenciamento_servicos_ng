import { NgModule } from "@angular/core";
import { MessageComponent } from "./message.component";
import { MessageListComponent } from "./message-list/message-list.component";
import { SharedModule } from "../../core/shared/shared.module";

@NgModule({
    declarations: [MessageComponent, MessageListComponent],
    exports: [],
    imports: [SharedModule],
})
export class MessageModule {}
