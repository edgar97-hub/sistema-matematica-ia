import { OrderPipelineStatus } from '../enums/order-pipeline-status.enum';
export declare class FilterOrderDto {
    status?: OrderPipelineStatus;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}
