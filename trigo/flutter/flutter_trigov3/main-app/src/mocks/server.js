import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Define handlers
const handlers = [
  // Mock payment methods endpoint
  rest.post('/api/payment-methods', (req, res, ctx) => {
    return res(
      ctx.json({
        paymentMethods: [
          {
            id: 'pm_test123',
            card: {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2024,
            },
          },
        ],
      })
    );
  }),

  // Mock create customer endpoint
  rest.post('/api/create-customer', (req, res, ctx) => {
    return res(
      ctx.json({
        customerId: 'cus_test123',
      })
    );
  }),

  // Mock setup intent endpoint
  rest.post('/api/create-setup-intent', (req, res, ctx) => {
    return res(
      ctx.json({
        clientSecret: 'seti_test123',
      })
    );
  }),

  // Mock remove payment method endpoint
  rest.post('/api/remove-payment-method', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
      })
    );
  }),

  // Mock ride booking endpoint
  rest.post('/api/book-ride', (req, res, ctx) => {
    return res(
      ctx.json({
        rideId: 'ride_test123',
        status: 'pending',
      })
    );
  }),

  // Mock ride status endpoint
  rest.get('/api/ride/:rideId/status', (req, res, ctx) => {
    const { rideId } = req.params;
    return res(
      ctx.json({
        status: 'accepted',
        driver: {
          name: 'John Doe',
          rating: 4.8,
          vehicle: {
            model: 'Toyota Vios',
            plate: 'ABC 123',
          },
        },
      })
    );
  }),
];

// Create server instance
export const server = setupServer(...handlers);

// Export handlers for individual test overrides
export { handlers };
