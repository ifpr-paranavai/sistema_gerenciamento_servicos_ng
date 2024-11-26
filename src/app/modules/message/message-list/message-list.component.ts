import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "sgs-message-list",
    templateUrl: "./message-list.component.html",
    styleUrls: ["./message-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageListComponent {

}