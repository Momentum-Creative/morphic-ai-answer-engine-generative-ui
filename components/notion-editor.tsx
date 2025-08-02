'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useConceptContext } from './concept-context'

const conceptNodes = [
  { id: 'brand', name: 'Brand', color: 'text-blue-500' },
  { id: 'trend', name: 'Trend', color: 'text-green-500' },
  { id: 'tone', name: 'Tone', color: 'text-purple-500' },
  { id: 'references', name: 'References', color: 'text-orange-500' },
  { id: 'inspo', name: 'Inspo', color: 'text-yellow-500' },
  { id: 'story', name: 'Story', color: 'text-red-500' },
  { id: 'style', name: 'Style', color: 'text-pink-500' },
  { id: 'platform', name: 'Platform', color: 'text-indigo-500' },
  { id: 'production', name: 'Production Guide', color: 'text-teal-500' }
]

interface NotionEditorProps {
  onSubmit: (content: string) => void
  isLoading?: boolean
}

export function NotionEditor({ onSubmit, isLoading }: NotionEditorProps) {
  const { selectedNodeId, nodeContent, setNodeContent } = useConceptContext()
  const [localContent, setLocalContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const selectedNode = conceptNodes.find(node => node.id === selectedNodeId)

  useEffect(() => {
    if (selectedNodeId) {
      setLocalContent(nodeContent[selectedNodeId] || '')
    } else {
      setLocalContent('')
    }
  }, [selectedNodeId, nodeContent])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [localContent])

  const handleSubmit = () => {
    if (localContent.trim() && selectedNodeId) {
      setNodeContent(selectedNodeId, localContent)
      onSubmit(localContent)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!selectedNodeId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Select a concept node to begin</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Choose one of the concept nodes above to start developing your video concept. 
          Your input will be processed by our AI to populate the relevant fields.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Node indicator */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
        <div className={cn('w-2 h-2 rounded-full', selectedNode?.color.replace('text-', 'bg-'))} />
        <span className="text-sm font-medium">
          Developing: {selectedNode?.name}
        </span>
      </div>

      {/* Notion-style editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Tell me about your ${selectedNode?.name.toLowerCase()} ideas...

Examples:
• "Our brand is modern and minimalist with a focus on sustainability"
• "The campaign should target Gen Z with an authentic, unfiltered tone"
• "Think Apple meets Patagonia - clean design with environmental values"`}
          className="w-full min-h-[120px] p-4 bg-transparent border-0 resize-none focus:outline-none text-sm leading-relaxed placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        
        {/* Submit button */}
        {localContent.trim() && (
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Process with AI
                  <span className="text-xs opacity-70">⌘⏎</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Existing content preview */}
      {nodeContent[selectedNodeId] && nodeContent[selectedNodeId] !== localContent && (
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Previously processed content:
          </div>
          <div className="text-sm text-foreground/80 line-clamp-3">
            {nodeContent[selectedNodeId]}
          </div>
        </div>
      )}
    </div>
  )
}
