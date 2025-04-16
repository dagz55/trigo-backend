"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { getFunctions } from "firebase/functions"
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  FlameIcon as Fire,
  Music,
  MicOffIcon as MusicOff,
  Instagram,
  Twitter,
  Facebook,
  Send,
  Moon,
  Sun,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import PaymentForm from "./components/payment-form"
import ShakePreview from "./components/shake-preview"
import BestsellerCarousel from "./components/bestseller-carousel"

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyB-DIB_VbHEl0xUrXy49OiG2jjws2gdLow",
  authDomain: "shake-website-9cc71.firebaseapp.com",
  projectId: "shake-website-9cc71",
  storageBucket: "shake-website-9cc71.firebasestorage.app",
  messagingSenderId: "26022140743",
  appId: "1:26022140743:web:f695ba31b248d154ca4a62",
  measurementId: "G-60K8ZCJKR1",
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

// Types
type ShakeSize = "S" | "M" | "L"
type MilkType = "Regular" | "Almond" | "Oat" | "Coconut" | "Soy"
type AddOn = "Pearls" | "Jelly" | "Chia Seeds" | "Protein Shot" | "Whipped Cream"

interface Shake {
  id: string
  name: string
  description: string
  image: string
  price: number
  color: string
  isVIP?: boolean
}

interface CustomShake {
  baseShake: Shake
  sugarLevel: number
  waterLevel: number
  iceLevel: number
  milkType: MilkType
  size: ShakeSize
  addOns: AddOn[]
  quantity: number
}

interface CartItem extends CustomShake {
  cartId: string
}

// Featured shakes data
const featuredShakes: Shake[] = [
  {
    id: "mango-tango",
    name: "Mango Tango",
    description: "Sweet mango blended with creamy milk and a hint of vanilla",
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 149,
    color: "bg-gradient-to-br from-yellow-300 to-orange-400",
  },
  {
    id: "berry-bae",
    name: "Berry Bae",
    description: "Mixed berries with a splash of lemon for that perfect balance",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 169,
    color: "bg-gradient-to-br from-pink-400 to-purple-500",
  },
  {
    id: "choco-burst",
    name: "Choco Burst",
    description: "Rich chocolate with a creamy texture that melts in your mouth",
    image:
      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=2939&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 159,
    color: "bg-gradient-to-br from-amber-700 to-yellow-600",
  },
  {
    id: "matcha-magic",
    name: "Matcha Magic",
    description: "Authentic matcha green tea with a smooth, earthy finish",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c504072a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 179,
    color: "bg-gradient-to-br from-green-400 to-emerald-500",
  },
  {
    id: "ube-supreme",
    name: "Ube Supreme",
    description: "Filipino favorite with sweet purple yam and creamy coconut milk",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 189,
    color: "bg-gradient-to-br from-purple-400 to-indigo-500",
  },
  {
    id: "top-d-combo",
    name: "🔥 Top D Combo",
    description: "Elite-tier shake with banana, peanut butter, dark cocoa, and espresso",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 219,
    color: "bg-gradient-to-br from-red-500 to-amber-500",
    isVIP: true,
  },
]

// Add-ons data
const addOns: { name: AddOn; price: number }[] = [
  { name: "Pearls", price: 25 },
  { name: "Jelly", price: 25 },
  { name: "Chia Seeds", price: 35 },
  { name: "Protein Shot", price: 45 },
  { name: "Whipped Cream", price: 20 },
]

// Size pricing
const sizePricing = {
  S: 0,
  M: 30,
  L: 50,
}

export default function PinoyBitesAndBlends() {
  // Firebase initialization
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const [app, setApp] = useState<any>(null)
  const [auth, setAuth] = useState<any>(null)
  const [db, setDb] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  // Theme
  const { theme, setTheme } = useTheme()

  // Router
  const router = useRouter()

  // State for customization
  const [selectedShake, setSelectedShake] = useState<Shake | null>(null)
  const [sugarLevel, setSugarLevel] = useState(100)
  const [waterLevel, setWaterLevel] = useState(50)
  const [iceLevel, setIceLevel] = useState(75)
  const [milkType, setMilkType] = useState<MilkType>("Regular")
  const [size, setSize] = useState<ShakeSize>("M")
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [quantity, setQuantity] = useState(1)

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // VIP feature state
  const [playingMusic, setPlayingMusic] = useState(false)

  // Initialize Firebase
  useEffect(() => {
    if (!firebaseInitialized && typeof window !== "undefined") {
      try {
        const firebaseApp = initializeApp(firebaseConfig)
        const firebaseAuth = getAuth(firebaseApp)
        const firebaseDb = getFirestore(firebaseApp)
        const firebaseFunctions = getFunctions(firebaseApp)

        // If you're running locally with Firebase emulators, uncomment this:
        // if (window.location.hostname === "localhost") {
        //   connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
        // }

        setApp(firebaseApp)
        setAuth(firebaseAuth)
        setDb(firebaseDb)
        setFirebaseInitialized(true)

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
          setUser(currentUser)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Firebase initialization error:", error)
      }
    }
  }, [firebaseInitialized])

  // Reset customization when selecting a new shake
  useEffect(() => {
    if (selectedShake) {
      setSugarLevel(100)
      setWaterLevel(50)
      setIceLevel(75)
      setMilkType("Regular")
      setSize("M")
      setSelectedAddOns([])
      setQuantity(1)

      // Auto-play music for VIP shake
      if (selectedShake.isVIP) {
        setPlayingMusic(true)
      } else {
        setPlayingMusic(false)
      }
    }
  }, [selectedShake])

  // Calculate total price
  useEffect(() => {
    console.log("Theme changed to:", theme)
  }, [theme])

  // Calculate total price
  const calculateItemPrice = (item: CustomShake) => {
    let price = item.baseShake.price

    // Add size price
    price += sizePricing[item.size]

    // Add add-ons price
    item.addOns.forEach((addOn) => {
      const addOnPrice = addOns.find((a) => a.name === addOn)?.price || 0
      price += addOnPrice
    })

    return price * item.quantity
  }

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + calculateItemPrice(item), 0)
  }

  // Add to cart
  const addToCart = () => {
    if (!selectedShake) return

    const newItem: CartItem = {
      cartId: `${Date.now()}`,
      baseShake: selectedShake,
      sugarLevel,
      waterLevel,
      iceLevel,
      milkType,
      size,
      addOns: [...selectedAddOns],
      quantity,
    }

    setCartItems([...cartItems, newItem])
    setCartOpen(true)

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    toast({
      title: "Added to cart!",
      description: `${selectedShake.name} has been added to your cart.`,
    })
  }

  // Remove from cart
  const removeFromCart = (cartId: string) => {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId))
  }

  // Update quantity
  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.cartId === cartId ? { ...item, quantity: newQuantity } : item)))
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth) return

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast({
        title: "Signed in successfully!",
        description: "You are now signed in with Google.",
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
      toast({
        title: "Sign in failed",
        description: "There was an error signing in with Google.",
        variant: "destructive",
      })
    }
  }

  // Sign out
  const handleSignOut = async () => {
    if (!auth) return

    try {
      await signOut(auth)
      toast({
        title: "Signed out successfully!",
        description: "You have been signed out.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Process order
  const processOrder = async (paymentMethod: string, formData: any) => {
    if (!db || !user) return

    try {
      // Add order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cartItems,
        total: calculateTotalPrice(),
        paymentMethod,
        customerInfo: formData,
        status: "pending",
        createdAt: new Date(),
      })

      setOrderComplete(true)
      setOrderNumber(orderRef.id.substring(0, 8).toUpperCase())
      setCartItems([])

      // Trigger confetti
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
      })
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Order failed",
        description: "There was an error processing your order.",
        variant: "destructive",
      })
    }
  }

  // Reset order
  const resetOrder = () => {
    setOrderComplete(false)
    setCheckoutStep(0)
    setCartOpen(false)
  }

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-sky-50 to-pink-50"}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-100 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              P
            </motion.div>
            {/* Replace the line with "by Mark Contillo" with the following: */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
                Pinoy Bites & Blends
              </h1>
              <p className="text-xs text-muted-foreground font-handwritten tracking-wide creator-names">
                Jandriv Echauz, Mikee Camoro & Mark Contillo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Log current theme before changing
                console.log("Current theme:", theme)
                // Toggle theme with a slight delay to ensure state updates
                setTimeout(() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                }, 0)
              }}
              className="mr-2"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:block">
                  <span className="text-sm font-medium">Hi, {user.displayName?.split(" ")[0] || "User"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={signInWithGoogle}>
                Sign In
              </Button>
            )}

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative ml-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} item(s) in your cart`}
                  </SheetDescription>
                </SheetHeader>

                {cartItems.length > 0 ? (
                  <>
                    {checkoutStep === 0 ? (
                      <div className="mt-6 space-y-6">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.cartId}
                            className="flex gap-4 pb-4 border-b"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={`w-16 h-16 rounded-lg ${item.baseShake.color} flex-shrink-0`}></div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-semibold">{item.baseShake.name}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeFromCart(item.cartId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.size}, {item.milkType} milk, {item.sugarLevel}% sugar
                              </p>
                              {item.addOns.length > 0 && (
                                <p className="text-xs text-muted-foreground">+ {item.addOns.join(", ")}</p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="font-semibold">₱{calculateItemPrice(item).toFixed(2)}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        <div className="pt-4 border-t">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₱{calculateTotalPrice().toFixed(2)}</span>
                          </div>
                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
                            onClick={() => {
                              if (user) {
                                setCheckoutStep(1)
                              } else {
                                toast({
                                  title: "Please sign in",
                                  description: "You need to sign in before checkout.",
                                  variant: "destructive",
                                })
                              }
                            }}
                          >
                            Proceed to Checkout
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6">
                        <Elements stripe={stripePromise}>
                          <PaymentForm
                            total={calculateTotalPrice()}
                            onBack={() => setCheckoutStep(0)}
                            onComplete={processOrder}
                          />
                        </Elements>
                      </div>
                    )}
                  </>
                ) : orderComplete ? (
                  <motion.div
                    className="mt-10 flex flex-col items-center justify-center text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 flex items-center justify-center mb-6"
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🥤</span>
                      </div>
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                    <p className="text-muted-foreground mb-4">
                      Your order #{orderNumber} has been placed successfully.
                    </p>
                    <div className="py-4 px-6 bg-pink-50 dark:bg-gray-800 rounded-lg mb-6">
                      <p className="text-sm">
                        We'll prepare your delicious food and drinks right away! Estimated delivery time: 30-45 minutes.
                      </p>
                    </div>
                    <Button
                      onClick={resetOrder}
                      className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
                    >
                      Back to Menu
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[70vh]">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{
                        rotate: [0, 10, 0, -10, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      🥤
                    </motion.div>
                    <p className="text-muted-foreground text-center">Your cart is empty. Add some delicious items!</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
                      onClick={() => setCartOpen(false)}
                    >
                      Browse Menu
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/90 to-yellow-400/90 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1570696516188-ade861b84a49?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Colorful Filipino food and drinks"
            width={1200}
            height={600}
            className="w-full h-[60vh] object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-6">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Taste of the Philippines
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-2 max-w-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Authentic Filipino bites and refreshing blends, made with fresh ingredients.
            </motion.p>
            {/* Find the line with "Signature Creations by Mark Contillo" and replace with: */}
            <motion.p
              className="text-md mb-8 max-w-2xl font-semibold font-handwritten tracking-wide creator-names"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Signature Creations by Jandriv Echauz, Mikee Camoro & Mark Contillo
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                size="lg"
                className="bg-white text-pink-500 hover:bg-white/90 font-bold text-lg px-8"
                onClick={() =>
                  window.scrollTo({ top: document.getElementById("bestsellers")?.offsetTop, behavior: "smooth" })
                }
              >
                Order Now
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Bestseller Carousel */}
        <section id="bestsellers" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-sans">Bestsellers</h2>
              {/* Find the line with "Mark Contillo's Signature Creations" and replace with: */}
              <p className="text-sm text-muted-foreground font-handwritten">Our Chefs' Signature Creations</p>
            </div>
            <div className="hidden md:block">
              <span className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs px-2 py-1 rounded-full">
                Fan Favorites ✨
              </span>
            </div>
          </div>

          <BestsellerCarousel shakes={featuredShakes} onSelectShake={setSelectedShake} selectedShake={selectedShake} />
        </section>

        {/* Customization Section */}
        {selectedShake && (
          <section className="mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Live Preview */}
                <div className="order-2 md:order-1">
                  <h2 className="text-xl font-bold mb-4 font-sans">Your Custom Order</h2>
                  <div className="bg-gradient-to-b from-sky-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 flex flex-col items-center">
                    <ShakePreview
                      shake={selectedShake}
                      sugarLevel={sugarLevel}
                      waterLevel={waterLevel}
                      iceLevel={iceLevel}
                      addOns={selectedAddOns}
                      isVIP={selectedShake.isVIP}
                      playingMusic={playingMusic}
                    />

                    <div className="mt-6 text-center">
                      <h3 className="font-bold text-lg font-sans">{selectedShake.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {size} • {sugarLevel}% Sugar • {iceLevel}% Ice
                      </p>
                      <p className="text-sm text-muted-foreground">{milkType} Milk</p>
                      {selectedAddOns.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 justify-center">
                          {selectedAddOns.map((addOn) => (
                            <Badge key={addOn} variant="outline" className="text-xs">
                              {addOn}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4">
                        <p className="text-lg font-bold">
                          ₱
                          {calculateItemPrice({
                            baseShake: selectedShake,
                            sugarLevel,
                            waterLevel,
                            iceLevel,
                            milkType,
                            size,
                            addOns: selectedAddOns,
                            quantity,
                          }).toFixed(2)}
                        </p>
                      </div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          className="mt-4 w-full bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white font-bold"
                          onClick={addToCart}
                        >
                          Add to Cart
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Customization Controls */}
                <div className="order-1 md:order-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-sans">Customize Your Order</h2>

                    {selectedShake.isVIP && (
                      <Button variant="ghost" size="sm" className="h-8" onClick={() => setPlayingMusic(!playingMusic)}>
                        {playingMusic ? <MusicOff className="h-4 w-4 mr-2" /> : <Music className="h-4 w-4 mr-2" />}
                        {playingMusic ? "Stop Beat" : "Play Beat"}
                      </Button>
                    )}
                  </div>

                  {selectedShake.isVIP && (
                    <motion.div
                      className={`mb-6 p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-amber-200 dark:border-amber-900 ${
                        playingMusic ? "animate-pulse" : ""
                      }`}
                      animate={
                        playingMusic
                          ? {
                              boxShadow: [
                                "0 0 0 rgba(237, 137, 54, 0.4)",
                                "0 0 20px rgba(237, 137, 54, 0.6)",
                                "0 0 0 rgba(237, 137, 54, 0.4)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Fire className="h-5 w-5 text-red-500" />
                        <h3 className="font-bold font-sans">VIP Top D Combo</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Our elite-tier shake with banana 🍌, peanut butter 🥜, dark cocoa 🍫, and espresso ☕.{" "}
                        <span className="font-bold">Real Fuel for Real Bosses.</span>
                      </p>
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    {/* Size Selection */}
                    <div>
                      <Label className="mb-2 block">Size</Label>
                      <div className="flex gap-2">
                        {(["S", "M", "L"] as ShakeSize[]).map((s) => (
                          <Button
                            key={s}
                            variant={size === s ? "default" : "outline"}
                            className={`flex-1 ${size === s ? "bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white" : ""}`}
                            onClick={() => setSize(s)}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Small</span>
                        <span>Medium (+₱30)</span>
                        <span>Large (+₱50)</span>
                      </div>
                    </div>

                    {/* Milk Type */}
                    <div>
                      <Label className="mb-2 block">Milk Type</Label>
                      <Select value={milkType} onValueChange={(value) => setMilkType(value as MilkType)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select milk type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Almond">Almond Milk</SelectItem>
                          <SelectItem value="Oat">Oat Milk</SelectItem>
                          <SelectItem value="Coconut">Coconut Milk</SelectItem>
                          <SelectItem value="Soy">Soy Milk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sugar Level */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Sugar Level</Label>
                        <span className="text-sm text-muted-foreground">{sugarLevel}%</span>
                      </div>
                      <Slider
                        value={[sugarLevel]}
                        min={0}
                        max={100}
                        step={25}
                        onValueChange={(value) => setSugarLevel(value[0])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Ice Level */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Ice Level</Label>
                        <span className="text-sm text-muted-foreground">{iceLevel}%</span>
                      </div>
                      <Slider
                        value={[iceLevel]}
                        min={0}
                        max={100}
                        step={25}
                        onValueChange={(value) => setIceLevel(value[0])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Water Level */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Water Level</Label>
                        <span className="text-sm text-muted-foreground">{waterLevel}%</span>
                      </div>
                      <Slider
                        value={[waterLevel]}
                        min={0}
                        max={100}
                        step={25}
                        onValueChange={(value) => setWaterLevel(value[0])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Add-ons */}
                    <div>
                      <Label className="mb-2 block">Add-ons</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {addOns.map((addOn) => (
                          <Button
                            key={addOn.name}
                            variant={selectedAddOns.includes(addOn.name) ? "default" : "outline"}
                            className={`justify-between ${
                              selectedAddOns.includes(addOn.name)
                                ? "bg-gradient-to-r from-pink-500/90 to-yellow-400/90 hover:from-pink-600 hover:to-yellow-500 text-white"
                                : ""
                            }`}
                            onClick={() => {
                              if (selectedAddOns.includes(addOn.name)) {
                                setSelectedAddOns(selectedAddOns.filter((a) => a !== addOn.name))
                              } else {
                                setSelectedAddOns([...selectedAddOns, addOn.name])
                              }
                            }}
                          >
                            <span>{addOn.name}</span>
                            <span className="text-xs">+₱{addOn.price.toFixed(2)}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Promotional Banner */}
        <section className="mb-16">
          <motion.div
            className="bg-gradient-to-r from-lime-400/90 to-green-500/90 dark:from-lime-600/90 dark:to-green-700/90 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-sans">Siomai Special! 🥟</h2>
              <p className="mb-4 max-w-2xl">
                Buy any six pieces of siomai and get two pieces free! Valid Monday-Thursday from 2-5 PM.
              </p>
              <Button className="bg-white text-green-500 hover:bg-white/90 font-bold">Learn More</Button>
            </div>
          </motion.div>
        </section>

        {/* Instagram Feed */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-sans">Pinoy Bites & Blends on Instagram</h2>
            <div className="hidden md:block">
              <span className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs px-2 py-1 rounded-full">
                @pinoybites
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3",
              "https://images.unsplash.com/photo-1586707101133-4f0c4ce4e284?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3",
              "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?q=80&w=2785&auto=format&fit=crop&ixlib=rb-4.0.3",
              "https://images.unsplash.com/photo-1551782450-17144efb9c50?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3",
            ].map((src, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Instagram post ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm">
                    Enjoying our {["Mango Tango", "Berry Bae", "Choco Burst", "Matcha Magic"][i]} shake! #PinoyBites
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-pink-500 to-yellow-400 dark:from-pink-600 dark:to-yellow-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-500 font-bold text-xl">
                  P
                </div>
                {/* Find the line with "by Mark Contillo" and replace with: */}
                <div>
                  <h2 className="text-xl font-bold font-sans">Pinoy Bites & Blends</h2>
                  <p className="text-xs text-white/80 font-handwritten tracking-wide creator-names">
                    Jandriv Echauz, Mikee Camoro & Mark Contillo
                  </p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Authentic Filipino bites and refreshing blends, made with fresh ingredients.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 font-sans">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Locations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 font-sans">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-white/80">123 Mabini Street, Manila</li>
                <li className="text-white/80">Phone: (555) 123-4567</li>
                <li className="text-white/80">Email: hello@pinoybites.com</li>
                <li className="text-white/80">Hours: 10AM - 10PM Daily</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
            {/* Find the line with "© {new Date().getFullYear()} Pinoy Bites & Blends by Mark Contillo. All rights reserved." and replace with: */}
            <p>
              © {new Date().getFullYear()} Pinoy Bites & Blends by Jandriv Echauz, Mikee Camoro & Mark Contillo. All
              rights reserved.
            </p>
            <p className="mt-2">Authentic Filipino Flavors 🇵🇭</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
