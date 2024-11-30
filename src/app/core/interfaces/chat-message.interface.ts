export interface IChatMessageListResponse {
    chat_id: number;
    participants: IChatParticipant[];
    created_at: string;
    'my_messages': IChatMessage[];
    'other_messages': IChatMessage[];
}

export interface IChatMessageSendResponse {
    'message_id': number;
    content: string;
    timestamp: Date;
}

export interface IChatMessageSendRequest {
    'chat_id': number;
    content: string;
}

export interface IChatParticipant {
    id: string;
    name: string;
    profile_picture?: string;
}

export interface IListChatMessage {
    messages: IChatMessage[];
}

export interface IChatMessage {
    id: string;
    'sender__name': string;
    content: string;
    timestamp: Date;
}
