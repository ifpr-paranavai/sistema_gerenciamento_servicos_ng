import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

interface Contact {
  id: number;
  name: string;
  avatar?: string | null;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
