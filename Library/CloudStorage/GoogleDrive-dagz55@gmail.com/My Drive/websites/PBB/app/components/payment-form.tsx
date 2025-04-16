"use client"

import type React from "react"

import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

// Add the following imports at the top of the file
import { createCheckoutSession, redirectToCheckout } from "../utils/payment"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
  total: number
  onBack: () => void
  onComplete: (paymentMethod: string, formData: any) => void
}

export default function PaymentForm({ total, onBack, onComplete }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  })

  // Inside the PaymentForm component, add the router
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Replace the handleSubmit function with this updated version:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === "stripe") {
        // Create a checkout session for Stripe
        const sessionData = {
          shake: "Cart Items", // You might want to customize this with actual cart details
          sugar: 100,
          water: 100,
          successURL: `${window.location.origin}/checkout/success`,
          cancelURL: `${window.location.origin}/checkout/cancel`,
          amount: total * 100, // Convert to centavos
        }

        const { id: sessionId } = await createCheckoutSession(sessionData)
        await redirectToCheckout(sessionId)
      } else {
        // Handle the original flow for other payment methods
        if (paymentMethod === "card") {
          if (!stripe || !elements) {
            setLoading(false)
            return
          }

          const cardElement = elements.getElement(CardElement)
          if (!cardElement) {
            setLoading(false)
            return
          }

          try {
            const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
              type: "card",
              card: cardElement,
            })

            if (error) {
              toast({
                title: "Payment failed",
                description: error.message,
                variant: "destructive",
              })
              setLoading(false)
              return
            }

            // Process the payment
            onComplete("card", {
              ...formData,
              paymentMethodId: stripePaymentMethod.id,
            })
          } catch (error) {
            console.error("Payment error:", error)
            toast({
              title: "Payment failed",
              description: "There was an error processing your payment.",
              variant: "destructive",
            })
          }
        } else if (paymentMethod === "gcash") {
          // Handle GCash payment
          try {
            const totalInCentavos = Math.round(total * 100); // Ensure amount is integer
            const res = await fetch('/api/create-gcash-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: totalInCentavos,
                description: `PBB Order - ${formData.name}`, // Customize description
                // Include other necessary details like metadata if needed by your aggregator
                metadata: { customerName: formData.name, customerEmail: formData.email, ...formData } // Example metadata
              })
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || `GCash payment initiation failed: ${res.statusText}`);
            }

            const data = await res.json();

            // Aggregator response structure might vary. Adjust based on actual response.
            // Assuming the aggregator returns a checkout_url in data.data.attributes
            const checkoutUrl = data?.data?.attributes?.checkout_url;

            if (checkoutUrl) {
              // Redirect user to GCash payment page
              window.location.href = checkoutUrl;
            } else {
              // Handle cases where redirect URL is not provided or structure is different
              console.error('GCash checkout URL not found in response:', data);
              toast({
                title: "GCash Error",
                description: "Could not initiate GCash payment. Please try again or select another method.",
                variant: "destructive",
              });
            }
            // No need to call onComplete here as redirection handles the next step

          } catch (error: any) {
            console.error("GCash payment error:", error);
            toast({
              title: "GCash Payment Error",
              description: error.message || "An error occurred while initiating GCash payment.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your checkout.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="Your name" required value={formData.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="Your address"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" placeholder="Your city" required value={formData.city} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Your phone number"
            required
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Your email"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value)}>
          {/* Update the Tabs component to include a "stripe" option */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
            <TabsTrigger value="gcash">GCash</TabsTrigger>
            <TabsTrigger value="stripe">Stripe Checkout</TabsTrigger>
          </TabsList>
          <TabsContent value="card" className="space-y-4">
            <div className="p-4 border rounded-md mt-2">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="gcash">
            <div className="p-4 border rounded-md mt-2 text-center">
              <div className="mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll be redirected to GCash to complete your payment after placing your order.
              </p>
            </div>
          </TabsContent>
          {/* Add a new TabsContent for Stripe */}
          <TabsContent value="stripe">
            <div className="p-4 border rounded-md mt-2 text-center">
              <div className="mb-4">
                <span className="text-4xl">💳</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll be redirected to Stripe's secure checkout page to complete your payment.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
            Back to Cart
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </form>
  )
}
