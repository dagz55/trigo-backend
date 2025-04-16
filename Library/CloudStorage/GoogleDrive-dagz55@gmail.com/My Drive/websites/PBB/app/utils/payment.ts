import { getFunctions, httpsCallable } from "firebase/functions"

export interface CheckoutSessionData {
  shake: string
  sugar: number
  water: number
  successURL: string
  cancelURL: string
  amount: number
}

export async function createCheckoutSession(data: CheckoutSessionData) {
  try {
    const functions = getFunctions()
    const createCheckoutSessionFn = httpsCallable(functions, "createCheckoutSession")

    const result = await createCheckoutSessionFn(data)
    return result.data as { id: string }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

export async function redirectToCheckout(sessionId: string) {
  const stripe = await import("@stripe/stripe-js").then((module) =>
    module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""),
  )

  if (!stripe) {
    throw new Error("Failed to load Stripe.js")
  }

  const result = await stripe.redirectToCheckout({
    sessionId,
  })

  if (result.error) {
    throw new Error(result.error.message)
  }
}
