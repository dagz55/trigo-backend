import type { NextApiRequest, NextApiResponse } from 'next';

// Placeholder for webhook verification logic (replace with actual aggregator's method)
const verifyWebhookSignature = (req: NextApiRequest): boolean => {
  // Example: Check a signature header provided by the aggregator
  // const signature = req.headers['x-aggregator-signature'];
  // const expectedSignature = calculateSignature(req.body, process.env.PAYMONGO_WEBHOOK_SECRET);
  // return signature === expectedSignature;
  console.warn('Webhook signature verification is not implemented. Implement based on your aggregator\'s documentation.');
  // In a real application, return false if verification fails
  return true; // Temporarily allow all requests for testing
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 1. Validate aggregator’s signature from headers
  if (!verifyWebhookSignature(req)) {
    console.error('Webhook signature verification failed.');
    return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
  }

  try {
    const event = req.body; // The structure depends on the aggregator's webhook payload

    console.log('Received webhook event:', JSON.stringify(event, null, 2));

    // 2. Parse event data to see if 'payment.success' or 'payment.paid'
    // Adjust the logic below based on the actual event structure from your aggregator
    const eventType = event?.data?.attributes?.type; // Example path, adjust as needed
    const paymentStatus = event?.data?.attributes?.data?.attributes?.status; // Example path

    if (eventType === 'payment.paid' || paymentStatus === 'paid' || eventType === 'source.chargeable') { // Adjust conditions based on aggregator
      const orderId = event?.data?.attributes?.data?.attributes?.metadata?.orderId; // Example: Get order ID from metadata
      const paymentId = event?.data?.attributes?.data?.id; // Example: Get payment ID

      if (!orderId) {
        console.warn('Webhook received for successful payment but no orderId found in metadata.');
        // Potentially still process if paymentId is enough, or log for investigation
      } else {
        console.log(`Processing successful payment webhook for order ${orderId}, payment ID ${paymentId}`);
        // 3. Update your DB / Prisma to mark the order as paid
        // Example: await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID', paymentId: paymentId } });
        console.log(`Order ${orderId} marked as paid in the database (simulation).`);
      }
    } else if (eventType === 'payment.failed' || paymentStatus === 'failed') {
      const orderId = event?.data?.attributes?.data?.attributes?.metadata?.orderId;
      console.log(`Payment failed webhook received for order ${orderId}.`);
      // Handle failed payment (e.g., update order status, notify user)
    } else {
      console.log(`Received unhandled webhook event type: ${eventType || 'Unknown Type'} / status: ${paymentStatus || 'Unknown Status'}`);
    }

    // Respond to the aggregator that the webhook was received successfully
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing GCash webhook:', error);
    res.status(500).json({ error: 'Internal server error while processing webhook.' });
  }
}