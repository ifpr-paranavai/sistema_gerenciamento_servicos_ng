export interface IDocumentsTemplateResponse {
    id: number;
    name: string;
    description: string;
    'file_types': string[];
    created_at: Date;
    updated_at: Date;
}
