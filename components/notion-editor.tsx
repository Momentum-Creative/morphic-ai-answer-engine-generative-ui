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
  { id: 'audience', name: 'Audience', color: 'text-emerald-500' },
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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-600/20 flex items-center justify-center mb-3">
          <span className="text-lg">✨</span>
        </div>
        <h3 className="text-base font-medium mb-2">Click a concept node above to start</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          Select Brand, Tone, Story, or any other node to begin developing your video concept with AI assistance.
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
      <div className="relative bg-background border border-border rounded-xl p-4 shadow-sm">
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
          className="w-full min-h-[120px] bg-transparent border-0 resize-none focus:outline-none text-sm leading-relaxed placeholder:text-muted-foreground"
          disabled={isLoading}
        />

        {/* Submit button - always visible in bottom right */}
        <div className="absolute bottom-3 right-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !localContent.trim()}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
              localContent.trim() && !isLoading
                ? "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white hover:shadow-md hover:scale-105"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            title={localContent.trim() ? "Submit content (⌘⏎)" : "Enter text to submit"}
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
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
