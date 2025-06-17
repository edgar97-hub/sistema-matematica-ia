export declare class PaginationParamsDto {
    page?: number;
    limit?: number;
}
export declare class FilterUserParamsDto {
    email?: string;
    name?: string;
    isActive?: boolean;
    countryOfOrigin?: string;
}
export declare class SortUserParamsDto {
    field?: string;
    direction?: 'ASC' | 'DESC';
}
export declare class FindAllUsersQueryDto {
    page?: number;
    limit?: number;
    sortField?: string;
    sortDirection?: 'ASC' | 'DESC';
    email?: string;
    name?: string;
    isActive?: boolean;
    countryOfOrigin?: string;
}
