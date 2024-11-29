export interface IChatMessageListResponse {
    chat_id: number;
    participants: ChatParticipant[];
    created_at: string;
}

export interface IChatMessageSendRequest {

}

export interface IChatMessageSendResponse {

}

export interface IChatMessageGetOrCreateRequest {
    'user_receiver_id': string;
}

export interface IChatMessageGetOrCreateResponse {
    
}

interface ChatParticipant {
    name: string;
    profile_picture: string; // Pode ser uma URL ou string vazia
}