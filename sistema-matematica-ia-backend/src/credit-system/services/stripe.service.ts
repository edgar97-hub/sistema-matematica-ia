import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { CustomLoggerService } from '../../common/services/logger.service';
import { CreditPackageEntity } from '../entities/credit-package.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService,
    @InjectRepository(CreditPackageEntity)
    private creditPackageRepository: Repository<CreditPackageEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  onModuleInit() {
    // const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    // if (!stripeSecretKey) {
    //   this.logger.error('STRIPE_SECRET_KEY is not defined in the environment variables', '', 'StripeService');
    //   throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
    // }
    // this.stripe = new Stripe(stripeSecretKey, {
    //   apiVersion: '2025-05-28.basil',
    // });
    // this.logger.log('Stripe service initialized', 'StripeService');
  }

  async createStripeCheckoutSession(userId: number, packageId: number): Promise<Stripe.Checkout.Session> {
    try {
      const creditPackage = await this.creditPackageRepository.findOne({ where: { id: packageId } });
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!creditPackage || !user) {
        throw new Error('Credit package or user not found');
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${creditPackage.credit_amount} Credits`,
                description: `Purchase of ${creditPackage.credit_amount} credits`,
              },
              unit_amount: creditPackage.price * 100, // Stripe usa centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.configService.get('FRONTEND_URL')}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('FRONTEND_URL')}/credits/cancel`,
        client_reference_id: userId.toString(),
        metadata: {
          packageId: packageId.toString(),
        },
      });

      this.logger.log(`Checkout session created: ${session.id}`, 'StripeService');
      return session;
    } catch (error) {
      this.logger.error(`Error creating checkout session: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
      });
      this.logger.log(`Payment intent created: ${paymentIntent.id}`, 'StripeService');
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      this.logger.log(`Payment intent confirmed: ${paymentIntent.id}`, 'StripeService');
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error confirming payment intent: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async createCustomer(email: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({ email });
      this.logger.log(`Customer created: ${customer.id}`, 'StripeService');
      return customer;
    } catch (error) {
      this.logger.error(`Error creating customer: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        usage: 'off_session',
      });
      this.logger.log(`Setup intent created: ${setupIntent.id}`, 'StripeService');
      return setupIntent;
    } catch (error) {
      this.logger.error(`Error creating setup intent: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async chargeCustomer(customerId: string, amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      if (paymentMethods.data.length === 0) {
        this.logger.error(`No payment method found for customer: ${customerId}`, '', 'StripeService');
        throw new Error('No payment method found for this customer');
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true,
      });

      this.logger.log(`Customer charged successfully: ${paymentIntent.id}`, 'StripeService');
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error charging customer: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async constructWebhookEvent(payload: string | Buffer, signature: string, webhookSecret: string): Promise<Stripe.Event> {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      this.logger.error(`Error constructing webhook event: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      this.logger.error(`Error retrieving checkout session: ${error.message}`, error.stack, 'StripeService');
      throw error;
    }
  }
}