import { NgModule } from "@angular/core";
import { ResetPasswordModalComponent } from "./reset-password-modal.component";
import { SharedModule } from "../../shared/shared.module";
import { AuthenticationRequest } from "../../requests/authentication/authentication.request";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [SharedModule, DialogModule],
    declarations: [ResetPasswordModalComponent],
    exports: [ResetPasswordModalComponent],
    providers: [AuthenticationRequest]
})
export class ResetPasswordModalModule {}
