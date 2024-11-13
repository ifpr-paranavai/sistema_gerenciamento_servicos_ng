export interface IDocumentsTemplateResponse {
    id: number;
    name: string;
    description: string;
    'file_types': string[];
    document: DocumentFile;
    created_at: Date;
    updated_at: Date;
}

export interface DocumentFile {
    lastModified: number;
    name: string;
    size: number;
    type: string;
    dataUrl: string;
}