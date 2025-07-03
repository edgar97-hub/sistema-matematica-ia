import { CreditService } from '../services/credit.service';
import { CustomLoggerService } from '../../common/services/logger.service';
export declare class CreditController {
    private readonly creditService;
    private readonly logger;
    constructor(creditService: CreditService, logger: CustomLoggerService);
}
