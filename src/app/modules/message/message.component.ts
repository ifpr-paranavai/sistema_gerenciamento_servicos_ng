import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "sgs-message",
    templateUrl: "./message.component.html",
    styleUrls: ["./message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {}
