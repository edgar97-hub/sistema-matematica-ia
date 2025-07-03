import { CreditService } from '../services/credit.service';
import { StripeService } from '../services/stripe.service';
import { CreditTransactionAction } from '../entities/credit-transaction.entity';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { CustomLoggerService } from '../../common/services/logger.service';
export declare class GetAllCreditTransactionsDto {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    action?: CreditTransactionAction;
    targetUserId?: string;
}
declare class CreateCheckoutSessionDto {
    packageId: number;
}
export declare class CreditTransactionController {
    private readonly creditService;
    private readonly stripeService;
    private readonly configService;
    private readonly logger;
    constructor(creditService: CreditService, stripeService: StripeService, configService: ConfigService, logger: CustomLoggerService);
    getAllCreditTransactions(queryDto: GetAllCreditTransactionsDto): Promise<{
        data: import("../entities/credit-transaction.entity").CreditTransactionEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminAdjustCredits(adjustmentData: {
        targetUserId: number;
        amount: number;
        reason: string;
    }, req: Request): Promise<import("../entities/credit-transaction.entity").CreditTransactionEntity>;
    getPurchaseStatus(sessionId: string, req: any): Promise<{
        status: string;
        message: string;
        creditsAdded?: undefined;
        newBalance?: undefined;
    } | {
        status: string;
        message: string;
        creditsAdded: number;
        newBalance: number;
    }>;
    createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto, req: Request): Promise<{
        id: string;
        object: "checkout.session";
        adaptive_pricing: Stripe.Checkout.Session.AdaptivePricing | null;
        after_expiration: Stripe.Checkout.Session.AfterExpiration | null;
        allow_promotion_codes: boolean | null;
        amount_subtotal: number | null;
        amount_total: number | null;
        automatic_tax: Stripe.Checkout.Session.AutomaticTax;
        billing_address_collection: Stripe.Checkout.Session.BillingAddressCollection | null;
        cancel_url: string | null;
        client_reference_id: string | null;
        client_secret: string | null;
        collected_information: Stripe.Checkout.Session.CollectedInformation | null;
        consent: Stripe.Checkout.Session.Consent | null;
        consent_collection: Stripe.Checkout.Session.ConsentCollection | null;
        created: number;
        currency: string | null;
        currency_conversion: Stripe.Checkout.Session.CurrencyConversion | null;
        custom_fields: Array<Stripe.Checkout.Session.CustomField>;
        custom_text: Stripe.Checkout.Session.CustomText;
        customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;
        customer_creation: Stripe.Checkout.Session.CustomerCreation | null;
        customer_details: Stripe.Checkout.Session.CustomerDetails | null;
        customer_email: string | null;
        discounts: Array<Stripe.Checkout.Session.Discount> | null;
        expires_at: number;
        invoice: string | Stripe.Invoice | null;
        invoice_creation: Stripe.Checkout.Session.InvoiceCreation | null;
        line_items?: Stripe.ApiList<Stripe.LineItem>;
        livemode: boolean;
        locale: Stripe.Checkout.Session.Locale | null;
        metadata: Stripe.Metadata | null;
        mode: Stripe.Checkout.Session.Mode;
        optional_items?: Array<Stripe.Checkout.Session.OptionalItem> | null;
        payment_intent: string | Stripe.PaymentIntent | null;
        payment_link: string | Stripe.PaymentLink | null;
        payment_method_collection: Stripe.Checkout.Session.PaymentMethodCollection | null;
        payment_method_configuration_details: Stripe.Checkout.Session.PaymentMethodConfigurationDetails | null;
        payment_method_options: Stripe.Checkout.Session.PaymentMethodOptions | null;
        payment_method_types: Array<string>;
        payment_status: Stripe.Checkout.Session.PaymentStatus;
        permissions: Stripe.Checkout.Session.Permissions | null;
        phone_number_collection?: Stripe.Checkout.Session.PhoneNumberCollection;
        presentment_details?: Stripe.Checkout.Session.PresentmentDetails;
        recovered_from: string | null;
        redirect_on_completion?: Stripe.Checkout.Session.RedirectOnCompletion;
        return_url?: string;
        saved_payment_method_options: Stripe.Checkout.Session.SavedPaymentMethodOptions | null;
        setup_intent: string | Stripe.SetupIntent | null;
        shipping_address_collection: Stripe.Checkout.Session.ShippingAddressCollection | null;
        shipping_cost: Stripe.Checkout.Session.ShippingCost | null;
        shipping_options: Array<Stripe.Checkout.Session.ShippingOption>;
        status: Stripe.Checkout.Session.Status | null;
        submit_type: Stripe.Checkout.Session.SubmitType | null;
        subscription: string | Stripe.Subscription | null;
        success_url: string | null;
        tax_id_collection?: Stripe.Checkout.Session.TaxIdCollection;
        total_details: Stripe.Checkout.Session.TotalDetails | null;
        ui_mode: Stripe.Checkout.Session.UiMode | null;
        url: string | null;
        wallet_options: Stripe.Checkout.Session.WalletOptions | null;
    }>;
    handleStripeWebhook(sig: string, req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
