import { NgModule } from "@angular/core";
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from "../../shared/shared.module";
import { ProfileModalComponent } from "./profile-modal.component";

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
    ],
    exports: [ProfileModalComponent],
    declarations: [ProfileModalComponent],
})
export class ProfileModalModule { }
