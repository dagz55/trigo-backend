'use client'

import Header from '@/components/Header'
import React from 'react'

// This component establishes the client boundary
export default function MainLayoutClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      {/* Footer or other client-side layout elements could go here */}
    </>
  )
} 