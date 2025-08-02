'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ConceptContextType {
  selectedNodeId: string | null
  setSelectedNodeId: (nodeId: string | null) => void
  nodeContent: Record<string, string>
  setNodeContent: (nodeId: string, content: string) => void
}

const ConceptContext = createContext<ConceptContextType | undefined>(undefined)

export function useConceptContext() {
  const context = useContext(ConceptContext)
  if (!context) {
    throw new Error('useConceptContext must be used within a ConceptProvider')
  }
  return context
}

export function ConceptProvider({ children }: { children: ReactNode }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [nodeContent, setNodeContentState] = useState<Record<string, string>>({})

  const setNodeContent = (nodeId: string, content: string) => {
    setNodeContentState(prev => ({ ...prev, [nodeId]: content }))
  }

  return (
    <ConceptContext.Provider
      value={{
        selectedNodeId,
        setSelectedNodeId,
        nodeContent,
        setNodeContent
      }}
    >
      {children}
    </ConceptContext.Provider>
  )
}
