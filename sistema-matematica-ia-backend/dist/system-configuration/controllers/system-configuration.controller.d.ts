import { SystemConfigurationService } from '../services/system-configuration.service';
import { UpdateConfigurationDto } from '../dto/update-configuration.dto';
export declare class SystemConfigurationController {
    private readonly systemConfigurationService;
    constructor(systemConfigurationService: SystemConfigurationService);
    getConfiguration(): Promise<import("../entities/system-configuration.entity").SystemConfigurationEntity>;
    updateConfiguration(updateConfigurationDto: UpdateConfigurationDto): Promise<import("../entities/system-configuration.entity").SystemConfigurationEntity>;
}
