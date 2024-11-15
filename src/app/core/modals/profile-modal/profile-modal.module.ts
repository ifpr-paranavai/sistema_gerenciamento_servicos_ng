import { NgModule } from "@angular/core";
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from "../../shared/shared.module";
import { ProfileModalComponent } from "./profile-modal.component";
import { DropdownModule } from "primeng/dropdown";

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
        DropdownModule,
    ],
    exports: [ProfileModalComponent],
    declarations: [ProfileModalComponent],
})
export class ProfileModalModule { }
