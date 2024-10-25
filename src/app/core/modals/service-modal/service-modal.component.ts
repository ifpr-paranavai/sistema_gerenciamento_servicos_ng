import { ChangeDetectionStrategy, Component, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../services/toastr/toast.service";

@Component({
    selector: "sgs-service-modal",
    templateUrl: "./service-modal.component.html",
    styleUrls: ["./service-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceModalComponent { 
    visible: WritableSignal<boolean> = signal(false);

    constructor(
        private toastService: ToastService,
    ) {}

    showDialog(): void {
        console.log("chegou aqui")
        this.visible.set(true);
    }
}