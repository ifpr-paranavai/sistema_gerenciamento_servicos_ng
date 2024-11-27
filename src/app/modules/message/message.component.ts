import { Component, OnInit } from '@angular/core';

interface Contact {
  id: number;
  name: string;
  avatar?: string | null;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  contacts: Contact[] = [
    { id: 1, name: 'Ana Maria', avatar: 'https://via.placeholder.com/35' },
    { id: 2, name: 'Carlos Silva', avatar: null },
    { id: 3, name: 'Beatriz Santos', avatar: 'https://via.placeholder.com/35' }
  ];

  searchTerm = '';
  filteredContacts = this.contacts;
  selectedContactId: number | null = null;
  messages: { [key: number]: any[] } = {};
  newMessage: string = '';
  showAddContactModal = false;

  constructor() {}

  ngOnInit(): void {
    this.filterContacts();
  }

  selectContact(contactId: number): void {
    this.selectedContactId = contactId;
  }

  sendMessage(): void {
    if (this.selectedContactId && this.newMessage.trim()) {
      if (!this.messages[this.selectedContactId]) {
        this.messages[this.selectedContactId] = [];
      }
      this.messages[this.selectedContactId].push({
        sender: 'Você',
        content: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newMessage = '';
    }
  }

  filterContacts(): void {
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddContactModal(): void {
    this.showAddContactModal = true;
  }

  closeAddContactModal(): void {
    this.showAddContactModal = false;
  }

  addContact(newContactName: string): void {
    if (newContactName.trim()) {
      const newId = this.contacts.length + 1;
      this.contacts.push({
        id: newId,
        name: newContactName,
        avatar: null // Contatos sem imagem têm avatar nulo
      });
      this.filterContacts();
      this.closeAddContactModal();
    }
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0)).slice(0, 2);
    return initials.join('');
  }
}
