import { Repository } from 'typeorm';
import { SystemConfigurationEntity } from '../entities/system-configuration.entity';
import { UpdateConfigurationDto } from '../dto/update-configuration.dto';
export declare class SystemConfigurationService {
    private systemConfigurationRepository;
    constructor(systemConfigurationRepository: Repository<SystemConfigurationEntity>);
    getConfiguration(): Promise<SystemConfigurationEntity>;
    updateConfiguration(updateConfigDto: UpdateConfigurationDto): Promise<SystemConfigurationEntity>;
}
