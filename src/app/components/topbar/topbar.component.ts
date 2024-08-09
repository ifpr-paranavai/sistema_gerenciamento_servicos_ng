import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'sgs-topbar',
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {

}