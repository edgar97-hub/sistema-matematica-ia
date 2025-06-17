export declare class CreateEducationalStageDto {
    name: string;
    description?: string;
    min_age?: number;
    max_age?: number;
    display_order: number;
    is_active?: boolean;
    country_id: number;
}
export declare class UpdateEducationalStageDto {
    name?: string;
    description?: string;
    min_age?: number;
    max_age?: number;
    display_order?: number;
    is_active?: boolean;
    country_id?: number;
}
