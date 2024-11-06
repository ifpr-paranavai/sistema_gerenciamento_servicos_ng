export interface IDocumentsTemplateResponse {
    id: number;
    name: string;
    description: string;
    'file_types': string[];
    document: File;
    created_at: Date;
    updated_at: Date;
}
