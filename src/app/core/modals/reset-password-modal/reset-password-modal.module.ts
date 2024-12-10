import { NgModule } from "@angular/core";
import { ResetPasswordModalComponent } from "./reset-password-modal.component";
import { SharedModule } from "../../shared/shared.module";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [SharedModule, DialogModule],
    declarations: [ResetPasswordModalComponent],
    exports: [ResetPasswordModalComponent],
    providers: []
})
export class ResetPasswordModalModule {}
