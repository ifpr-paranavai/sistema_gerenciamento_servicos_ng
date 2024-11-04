export enum DocumentType {
    START_SERVICE = 'start',
    END_SERVICE = 'end',
}

export interface IDocumentFile {
    id: number;
    file_name: string;
    file_type: string;
    file_size: number;
    file_content: string;
    document_type: string;
    created_at: Date;
    updated_at: Date;
}
