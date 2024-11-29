import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

interface Contact {
    id: number;
    name: string;
    avatar?: string | null;
}

@Component({
    selector: 'sgs-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
    userMessages: string[] = ['Olá, tudo bem?'];
    myMessages: string[] = ['Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?'];

    constructor() { }

    ngOnInit(): void {
    }
}
