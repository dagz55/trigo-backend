import type { NextApiRequest, NextApiResponse } from 'next';

// This example uses a fictional aggregator, but real aggregator docs are similar.
// Replace with your actual aggregator's API endpoint and authentication method.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { amount, description } = req.body;

  // Basic validation
  if (typeof amount !== 'number' || amount <= 0 || typeof description !== 'string') {
    return res.status(400).json({ error: 'Invalid input: amount must be a positive number and description must be a string.' });
  }

  // Ensure environment variables are set
  const secretKey = process.env.PAYMONGO_SECRET_KEY; // Replace with your actual env variable name
  if (!secretKey) {
    console.error('Payment aggregator secret key is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // 1. Create a payment request with your aggregator
  // Replace 'https://api.paymongo.com/v1/payments' with the actual endpoint
  try {
    const response = await fetch('https://api.paymongo.com/v1/payments', { // Replace with actual aggregator endpoint
      method: 'POST',
      headers: {
        // Adjust Authorization based on your aggregator (Basic Auth, Bearer Token, etc.)
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`, // Example for Basic Auth
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount, // Amount should be in the smallest currency unit (e.g., centavos)
            payment_method_allowed: ['gcash'],
            payment_method_options: { gcash: {} }, // Specific options might be needed
            description: description,
            currency: 'PHP',
            // Add other required fields like 'statement_descriptor', 'metadata', 'return_url' as needed by your aggregator
          }
        }
      })
    });

    if (!response.ok) {
      // Log detailed error from the aggregator if possible
      const errorBody = await response.text();
      console.error(`Aggregator API error: ${response.status} ${response.statusText}`, errorBody);
      return res.status(response.status).json({ error: `Payment provider error: ${response.statusText}` });
    }

    const paymentData = await response.json();

    // 2. Return the aggregator's response to the frontend
    // The structure of paymentData will depend on the aggregator
    return res.status(200).json(paymentData);

  } catch (error) {
    console.error('Error creating GCash payment:', error);
    return res.status(500).json({ error: 'Internal server error while creating payment.' });
  }
}