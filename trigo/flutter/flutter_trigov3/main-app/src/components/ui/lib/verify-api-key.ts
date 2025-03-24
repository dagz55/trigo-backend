"use client"

export async function verifyGoogleMapsApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Make a simple request to the Google Maps Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`,
    )

    const data = await response.json()

    if (data.error_message) {
      return {
        valid: false,
        error: data.error_message,
      }
    }

    if (data.status === "OK") {
      return { valid: true }
    } else {
      return {
        valid: false,
        error: `API returned status: ${data.status}`,
      }
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

