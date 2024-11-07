import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { ProfileModalComponent } from "../../core/modals/profile-modal/profile-modal.component";

@Component({
    selector: 'sgs-topbar',
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
    @ViewChild(ProfileModalComponent) profileModal?: ProfileModalComponent;


    constructor() {}

    openProfileModal(): void {
        if (!this.profileModal) throw new Error("Profile modal not found!");

        this.profileModal.openDialog();
    }
}
