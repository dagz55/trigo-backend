import { loadStripe } from '@stripe/stripe-js';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentMethods = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().stripeCustomerId) {
          const response = await fetch('/api/payment-methods', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerId: userDoc.data().stripeCustomerId,
            }),
          });
          const data = await response.json();
          setPaymentMethods(data.paymentMethods);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [currentUser.uid, db]);

  const handleAddCard = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      let customerId = userDoc.data()?.stripeCustomerId;

      if (!customerId) {
        // Create a new customer in Stripe
        const response = await fetch('/api/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: currentUser.email,
            userId: currentUser.uid,
          }),
        });
        const data = await response.json();
        customerId = data.customerId;

        // Update user document with Stripe customer ID
        await updateDoc(doc(db, 'users', currentUser.uid), {
          stripeCustomerId: customerId,
        });
      }

      // Create a SetupIntent
      const setupResponse = await fetch('/api/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
        }),
      });
      const { clientSecret } = await setupResponse.json();

      // Open Stripe Elements modal
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            email: currentUser.email,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Refresh payment methods list
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
        }),
      });
      const data = await response.json();
      setPaymentMethods(data.paymentMethods);
      setShowAddCard(false);
      toast.success('Card added successfully');
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error(error.message);
    }
  };

  const handleRemoveCard = async (paymentMethodId) => {
    try {
      await fetch('/api/remove-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          customerId: userDoc.data().stripeCustomerId,
        }),
      });

      setPaymentMethods((prev) =>
        prev.filter((method) => method.id !== paymentMethodId)
      );
      toast.success('Card removed successfully');
    } catch (error) {
      console.error('Error removing card:', error);
      toast.error('Failed to remove card');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Payment Methods</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Saved Cards</h2>
          <button
            onClick={() => setShowAddCard(true)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Add New Card
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <p className="text-gray-500">No payment methods saved</p>
        ) : (
          <ul className="space-y-4">
            {paymentMethods.map((method) => (
              <li
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    {method.card.brand === 'visa' ? (
                      <span className="text-2xl">💳</span>
                    ) : (
                      <span className="text-2xl">💳</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.card.brand.charAt(0).toUpperCase() +
                        method.card.brand.slice(1)}{' '}
                      ending in {method.card.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {method.card.exp_month}/{method.card.exp_year}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCard(method.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Card</h3>
            <div id="card-element" className="mb-4"></div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods; 