import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CountryService } from '../services/country.service';
import { CreateCountryDto, UpdateCountryDto } from '../dto/country.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { EducationalContentService } from '../services/educational-content.service';

@Controller('countries')
export class CountryController {
  constructor(
    private readonly countryService: CountryService,
    private readonly educationalContentService: EducationalContentService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter?: string,
    @Query('sort') sort?: string
  ) {
    return this.countryService.findAll(page, limit, filter, sort);
  }

  @Get('pwa-list')
  findActiveForPwa() {
    return this.countryService.findActiveCountriesForPwa();
  }

  @Get('admin/structure')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getCompleteStructure() {
    return this.educationalContentService.getCompleteStructure();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }
}