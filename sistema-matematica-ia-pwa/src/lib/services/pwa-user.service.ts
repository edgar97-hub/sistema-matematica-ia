// src/lib/services/pwa-user.service.ts
import {
  TableColumnFilter,
  TablePaginationState,
  TableSortingState,
} from "project/app/(admin_panel)/admin/users-pwa/page";
import {
  PaginatedUsersResponse,
  PaginationQueryFE,
  FilterUserFE,
  SortUserFE,
  UserPwaFE,
} from "../../types/user.types"; // Ajusta ruta
import { apiClient } from "../apiClient"; // Asume que tienes un apiClient configurado

export interface GetUsersParams {
  pagination: TablePaginationState;
  sorting: TableSortingState[];
  columnFilters: TableColumnFilter[];
  // globalFilter?: string; // Si lo necesitas
}
export const pwaUserService = {
  async getUsers(params: GetUsersParams): Promise<PaginatedUsersResponse> {
    const queryParams: any = {};

    // 1. Mapear Paginación (PaginationQueryDto)
    queryParams.page = params.pagination.pageIndex + 1; // API es 1-based, frontend (Mantine Table) es 0-based
    queryParams.limit = params.pagination.pageSize;

    // 2. Mapear Ordenamiento (SortUserDto)
    if (params.sorting && params.sorting.length > 0) {
      queryParams.sortField = params.sorting[0].id; // 'field' es lo que espera SortUserDto
      queryParams.sortDirection = params.sorting[0].desc ? "DESC" : "ASC"; // 'direction' es lo que espera SortUserDto
    } else {
      // Opcional: Enviar un ordenamiento por defecto si no se especifica ninguno desde la tabla
      // queryParams.field = 'name'; // O 'createdAt'
      // queryParams.direction = 'ASC';
    }

    if (params.columnFilters && params.columnFilters.length > 0) {
      params.columnFilters.forEach((filter) => {
        if (
          filter.value !== undefined &&
          filter.value !== "" &&
          filter.value !== null
        ) {
          queryParams[filter.id] = filter.value;
        }
      });
    }

    const response = await apiClient.get<PaginatedUsersResponse>("/users", {
      params: queryParams,
    });
    return response.data;
  },

  async deactivateUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async activateUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  // async getUserById(id: string): Promise<UserPwaFE> {
  //   const response = await apiClient.get<UserPwaFE>(`/users/${id}`);
  //   console.log("response", response);
  //   return response.data;
  // },
  // src/lib/services/pwa-user.service.ts
  async getUserById(id: string): Promise<UserPwaFE> {
    console.log(`PWAUSER_SERVICE: Attempting to fetch user with ID: ${id}`); // LOG AQUÍ
    if (!id) {
      console.error("PWAUSER_SERVICE: getUserById called with no ID.");
      return Promise.reject(new Error("User ID is required"));
    }
    try {
      const response = await apiClient.get<UserPwaFE>(`/users/${id}`); // Endpoint del backend
      console.log(`PWAUSER_SERVICE: Data received for ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`PWAUSER_SERVICE: Error fetching user ${id}:`, error);
      throw error;
    }
  },

  async updateUser(
    id: string,
    data: Partial<Omit<UserPwaFE, "id" | "createdAt" | "updatedAt">>
  ): Promise<UserPwaFE> {
    const { email, ...user } = data;
    const response = await apiClient.patch<UserPwaFE>(`/users/${id}`, user);
    return response.data;
  },
};
