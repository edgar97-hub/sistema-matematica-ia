import { OrderPipelineStatus } from '../enums/order-pipeline-status.enum';
export declare class UpdateOrderStatusAdminDto {
    status: OrderPipelineStatus;
    adminNotes?: string;
}
