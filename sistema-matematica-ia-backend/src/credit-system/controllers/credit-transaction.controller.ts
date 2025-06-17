import { Controller, Get, Post, Param, Query, Body, UseGuards, BadRequestException, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CreditService } from '../services/credit.service';
import { StripeService } from '../services/stripe.service';
import { CreditTransactionAction } from '../entities/credit-transaction.entity';
import { IsOptional, IsInt, Min, IsDateString, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { CustomLoggerService } from '../../common/services/logger.service';
import * as rawBody from 'raw-body';

class GetAllCreditTransactionsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(CreditTransactionAction)
  action?: CreditTransactionAction;
}

class CreateCheckoutSessionDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  packageId: number;
}

@Controller('credit-transactions')
export class CreditTransactionController {
  constructor(
    private readonly creditService: CreditService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    const { packageId } = createCheckoutSessionDto;

    const session = await this.stripeService.createStripeCheckoutSession(userId, packageId);
    return { sessionId: session.id };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('history/:userId')
  async getUserCreditHistory(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.creditService.getUserCreditHistory(userId, page, limit);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllCreditTransactions(@Query() query: GetAllCreditTransactionsDto) {
    const { page = 1, limit = 10, startDate, endDate, action } = query;
    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (action) filters.action = action;

    return this.creditService.getAllCreditTransactions(page, limit, filters);
  }

  @Post('stripe-webhook')
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      this.logger.error('Stripe webhook secret is not defined', '', 'CreditTransactionController');
      return res.status(500).send('Webhook Error: Secret is not configured');
    }

    let event: Stripe.Event;

    try {
      const body = await rawBody(req);
      event = await this.stripeService.constructWebhookEvent(body, sig, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`, err.stack, 'CreditTransactionController');
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        await this.creditService.handleCheckoutSessionCompleted(session);
        this.logger.log(`Credit purchase confirmed for session: ${session.id}`, 'CreditTransactionController');
      } catch (error) {
        this.logger.error(`Error handling completed checkout session: ${error.message}`, error.stack, 'CreditTransactionController');
        // We don't want to send an error response to Stripe, as it will retry the webhook
        // Instead, we'll log the error and send a 200 response
      }
    }

    res.json({ received: true });
  }

  @Post('admin/adjust')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async adminAdjustCredits(
    @Body() adjustmentData: { userId: number; amount: number; reason: string }
  ) {
    const { userId, amount, reason } = adjustmentData;
    return this.creditService.adminAdjustCredits(userId, amount, reason);
  }
}

// Helper function to get raw body from request
function getRawBody(req: Request): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data));
    });
    req.on('error', reject);
  });
}