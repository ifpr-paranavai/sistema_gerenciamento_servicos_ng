import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { SharedModule } from "../../core/shared/shared.module";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";
import { PasswordModule } from "primeng/password";
import { ToastModule } from "primeng/toast";
import { LoginRoutingModule } from "./login-routing.module";
import { ToastService } from "../../core/requests/toastr/toast.service";
import { ResetPasswordModalModule } from "../../core/modals/reset-password-modal/reset-password-modal.module";

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        LoginRoutingModule,
        SharedModule,
        InputTextModule,
        FloatLabelModule,
        PasswordModule,
        ToastModule,
        ResetPasswordModalModule,
    ],
    providers: [
        ToastService
    ],
})
export class LoginModule {}
