import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El número de página debe ser un entero.' })
  @Min(1, { message: 'El número de página debe ser al menos 1.' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un entero.' })
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  @Max(50, { message: 'El límite no puede ser mayor a 50.' })
  limit?: number = 10;
}

/**
 * Define la estructura estándar para una respuesta de API paginada.
 * Es genérica para poder reutilizarse con cualquier tipo de dato (ej. OrderFE, UserFE, etc.).
 * @template T El tipo de los datos que contiene el array 'data'.
 */
export interface PaginatedResponse<T> {
  /**
   * El array de registros para la página actual.
   */
  data: T[];

  /**
   * Metadatos sobre la paginación.
   */
  meta: {
    /**
     * El número total de registros en la base de datos que coinciden con la consulta.
     */
    total: number;

    /**
     * El número de la página actual.
     */
    page: number;

    /**
     * El número de la última página disponible.
     */
    lastPage: number;
  };
}
