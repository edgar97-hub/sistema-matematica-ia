import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe, Query, BadRequestException, HttpStatus, HttpCode, NotFoundException, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from '../users/users/users.service';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../users/decorators/user.decorator';
import { extname } from 'path';
import { Multer } from 'multer';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SortOrderDto } from './dto/sort-order.dto';
import { OrderPipelineStatus } from './enums/order-pipeline-status.enum';
import { UpdateOrderStatusAdminDto } from './dto/update-order-status-admin.dto';

export const imageFileFilterHelper = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,
    private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFileFilterHelper,
  }))
  async create(
    @User() user: any,
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFile() imageFile: any,
  ) {
    try {
      return await this.ordersService.createOrder(user.id.toString(), createOrderDto, imageFile);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(@User() user: any, @Query('page') page: string, @Query('limit') limit: string) {
    try {
      return await this.ordersService.findUserOrders(user.id.toString(), parseInt(page), parseInt(limit));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: any) {
    try {
      const order = await this.ordersService.findOrderByIdForUser(id, user.id.toString());
      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAllOrders(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query() filters: FilterOrderDto,
    @Query() sort: SortOrderDto,
  ) {
    try {
      return await this.ordersService.findAllOrders(page, limit, filters, sort);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOrderByIdForAdmin(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.ordersService.findOrderByIdForAdmin(id.toString());
      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateOrderStatusByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusAdminDto: UpdateOrderStatusAdminDto,
  ) {
    try {
      return await this.ordersService.updateOrderStatusByAdmin(id.toString(), updateOrderStatusAdminDto.status, updateOrderStatusAdminDto.adminNotes);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
