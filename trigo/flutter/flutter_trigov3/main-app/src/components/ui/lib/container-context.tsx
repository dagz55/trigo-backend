"use client"

import { createContext, useContext, type ReactNode } from "react"

type ContainerType = "passenger" | "driver" | "dispatcher"

interface ContainerContextType {
  containerType: ContainerType
  isPassenger: boolean
  isDriver: boolean
  isDispatcher: boolean
}

const ContainerContext = createContext<ContainerContextType>({
  containerType: "passenger",
  isPassenger: true,
  isDriver: false,
  isDispatcher: false,
})

export function ContainerProvider({ children }: { children: ReactNode }) {
  // Get container type from environment variable
  const containerType = (process.env.NEXT_PUBLIC_CONTAINER_TYPE || "passenger") as ContainerType

  const value = {
    containerType,
    isPassenger: containerType === "passenger",
    isDriver: containerType === "driver",
    isDispatcher: containerType === "dispatcher",
  }

  return <ContainerContext.Provider value={value}>{children}</ContainerContext.Provider>
}

export function useContainer() {
  return useContext(ContainerContext)
}

