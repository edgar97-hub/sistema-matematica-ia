import { OrderPipelineStatus } from '../enums/order-pipeline-status.enum';
export declare class FilterOrderDto {
    status?: OrderPipelineStatus;
    userId?: number;
    startDate?: Date;
    endDate?: Date;
}
