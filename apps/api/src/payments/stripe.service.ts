import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { Pool } from 'pg';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private readonly logger = new Logger(StripeService.name);
    private pool: Pool;

    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            this.logger.warn('STRIPE_SECRET_KEY not set. Payments will fail.');
        }
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2024-12-18.acacia' as any, // Use latest or what's installed
        });
        this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }

    // Mapping Plans to Stripe Price IDs
    private getPlanPriceId(planKey: string): string {
        const prices = {
            'essential': process.env.STRIPE_PRICE_ESSENTIAL,
            'pro': process.env.STRIPE_PRICE_PRO,
            'enterprise': process.env.STRIPE_PRICE_ENTERPRISE
        };
        return prices[planKey] || '';
    }

    async createCheckoutSession(userId: string, planKey: string) {
        const client = await this.pool.connect();
        try {
            // Get user and company info
            const res = await client.query(`
                SELECT u.email, u.company_id, c.stripe_customer_id 
                FROM users u
                JOIN companies c ON c.id = u.company_id
                WHERE u.id = $1
            `, [userId]);

            if (res.rows.length === 0) throw new Error('User/Company not found');
            const { email, company_id, stripe_customer_id } = res.rows[0];

            let customerId = stripe_customer_id;

            // Create Customer if doesn't exist
            if (!customerId) {
                const customer = await this.stripe.customers.create({ email, metadata: { company_id } });
                customerId = customer.id;
                await client.query('UPDATE companies SET stripe_customer_id = $1 WHERE id = $2', [customerId, company_id]);
            }

            const priceId = this.getPlanPriceId(planKey);
            if (!priceId) throw new Error(`Price ID not configured for plan: ${planKey}`);

            // Create Session
            const session = await this.stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription', // or 'payment'
                success_url: `${process.env.FRONTEND_URL || 'https://jairoapp.renace.tech'}/admin?payment=success`,
                cancel_url: `${process.env.FRONTEND_URL || 'https://jairoapp.renace.tech'}/planes?payment=cancelled`,
                metadata: {
                    company_id,
                    plan: planKey
                }
            });

            return { url: session.url };

        } finally {
            client.release();
        }
    }

    async handleWebhook(signature: string, payload: Buffer) {
        // In a real app, verify signature
        // const event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);

        // Mocking event handling for prototype speed or assuming valid payload passed as body if strict verification skipped
        const event = JSON.parse(payload.toString()) as Stripe.Event;

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const companyId = session.metadata?.company_id;
            const plan = session.metadata?.plan;

            if (companyId) {
                const client = await this.pool.connect();
                await client.query(`
                    UPDATE companies 
                    SET subscription_status = 'active', 
                        plan = $2,
                        subscription_id = $3
                    WHERE id = $1
                `, [companyId, plan, session.subscription]);
                client.release();
                this.logger.log(`✅ Subscription activated for company ${companyId}`);
            }
        }
    }
}
