'use client'

import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'

import { Message } from 'ai'
import { ArrowUp, ChevronDown, MessageCirclePlus, Square, Plus } from 'lucide-react'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { useArtifact } from './artifact/artifact-context'
import { Button } from './ui/button'
import { IconLogo } from './ui/icons'
import { ConceptNodes } from './concept-nodes'

import { EmptyScreen } from './empty-screen'
import { ProjectIndicator } from './project-indicator'
import { NotionEditor } from './notion-editor'
import { useConceptContext } from './concept-context'

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
  models?: Model[]
  /** Whether to show the scroll to bottom button */
  showScrollToBottomButton: boolean
  /** Reference to the scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement>
}

export function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  models,
  showScrollToBottomButton,
  scrollContainerRef
}: ChatPanelProps) {
  const { selectedNodeId } = useConceptContext()
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false) // Composition state
  const [enterDisabled, setEnterDisabled] = useState(false) // Disable Enter after composition ends
  const { close: closeArtifact } = useArtifact()

  const handleCompositionStart = () => setIsComposing(true)

  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleNewChat = () => {
    setMessages([])
    closeArtifact()
    router.push('/')
  }

  const isToolInvocationInProgress = () => {
    if (!messages.length) return false

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'assistant' || !lastMessage.parts) return false

    const parts = lastMessage.parts
    const lastPart = parts[parts.length - 1]

    return (
      lastPart?.type === 'tool-invocation' &&
      lastPart?.toolInvocation?.state === 'call'
    )
  }

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({
        role: 'user',
        content: query
      })
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Scroll to the bottom of the container
  const handleScrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      className={cn(
        'w-full bg-transparent group/form-container pb-20',
        messages.length > 0 ? 'px-2' : 'px-6 pt-4 mt-4'
      )}
    >
      {messages.length === 0 && (
        <div className="mb-10 flex flex-col items-center gap-6 pt-5">
          <ProjectIndicator conceptProgress={messages.length > 0 ? 50 : 0} />
          <p className="text-center text-3xl font-semibold">
            Video Concept Copilot
          </p>

          {/* Concept nodes */}
          <div className="w-full max-w-3xl mx-auto mb-6">
            <ConceptNodes />
          </div>

          {/* Notion-style editor for concept development */}
          <div className="w-full max-w-2xl mx-auto">
            <NotionEditor
              onSubmit={(content) => {
                if (selectedNodeId) {
                  // Create a formatted message that includes the node context
                  const nodeMessage = `[${selectedNodeId.toUpperCase()}] ${content}`;
                  append({
                    role: 'user',
                    content: nodeMessage
                  })
                }
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
      {/* New dedicated chat window for concept agent */}
      <div className="fixed bottom-8 left-0 md:left-[var(--sidebar-width)] right-0 z-20">
        <div className="max-w-3xl mx-auto px-4 pb-6">
          <form onSubmit={handleSubmit} className="relative">
            {/* Scroll to bottom button */}
            {showScrollToBottomButton && messages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -top-12 right-4 z-20 size-8 rounded-full shadow-md"
                onClick={handleScrollToBottom}
                title="Scroll to bottom"
              >
                <ChevronDown size={16} />
              </Button>
            )}

            <div className="relative flex items-start gap-3 bg-background/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg p-3">
              {/* File upload button */}
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    console.log('File selected:', file.name)
                    // Handle file upload here
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-accent flex-shrink-0"
                onClick={() => document.getElementById('file-upload')?.click()}
                title="Upload file"
              >
                <Plus className="size-4 text-muted-foreground" />
              </Button>

              <Textarea
                ref={inputRef}
                name="input"
                rows={1}
                maxRows={8}
                tabIndex={0}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Ask the concept agent anything about your project..."
                spellCheck={false}
                value={input}
                disabled={isLoading || isToolInvocationInProgress()}
                className="resize-none flex-1 bg-transparent border-0 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[20px]"
                onChange={e => {
                  handleInputChange(e)
                  setShowEmptyScreen(e.target.value.length === 0)
                }}
                onKeyDown={e => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !isComposing &&
                    !enterDisabled
                  ) {
                    if (input.trim().length === 0) {
                      e.preventDefault()
                      return
                    }
                    e.preventDefault()
                    const textarea = e.target as HTMLTextAreaElement
                    textarea.form?.requestSubmit()
                  }
                }}
                onFocus={() => setShowEmptyScreen(true)}
                onBlur={() => setShowEmptyScreen(false)}
              />

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    className="size-8 rounded-full hover:bg-accent"
                    type="button"
                    disabled={isLoading || isToolInvocationInProgress()}
                    title="New chat"
                  >
                    <MessageCirclePlus className="size-4" />
                  </Button>
                )}

                <Button
                  type={isLoading ? 'button' : 'submit'}
                  size="icon"
                  className={cn(
                    "size-8 rounded-full",
                    input.trim().length > 0
                      ? "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-md"
                      : "bg-muted text-muted-foreground"
                  )}
                  disabled={
                    (input.length === 0 && !isLoading) ||
                    isToolInvocationInProgress()
                  }
                  onClick={isLoading ? stop : undefined}
                >
                  {isLoading ? <Square size={16} /> : <ArrowUp size={16} />}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

        {messages.length === 0 && (
          <EmptyScreen
            submitMessage={message => {
              handleInputChange({
                target: { value: message }
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            className={cn(showEmptyScreen ? 'visible' : 'invisible')}
          />
        )}
    </div>
  )
}
