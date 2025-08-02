'use client'

import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'

import { Message } from 'ai'
import { ArrowUp, ChevronDown, MessageCirclePlus, Square } from 'lucide-react'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { useArtifact } from './artifact/artifact-context'
import { Button } from './ui/button'
import { IconLogo } from './ui/icons'
import { ConceptNodes } from './concept-nodes'
import { CreditsIndicator } from './credits-indicator'
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
        'w-full bg-transparent group/form-container',
        messages.length > 0 ? 'sticky bottom-0 px-2 pb-4 z-10' : 'px-6'
      )}
    >
      {messages.length === 0 && (
        <div className="mb-10 flex flex-col items-center gap-6">
          <ProjectIndicator conceptProgress={messages.length > 0 ? 50 : 0} />
          <p className="text-center text-3xl font-semibold">
            Video Concept Copilot
          </p>

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
      <form
        onSubmit={handleSubmit}
        className={cn('max-w-3xl w-full mx-auto relative')}
      >
        {/* Scroll to bottom button - only shown when showScrollToBottomButton is true */}
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-10 right-4 z-20 size-8 rounded-full shadow-md"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </Button>
        )}

        <div className={cn(
          "relative flex flex-col w-full gap-2 bg-muted rounded-3xl border border-input",
          messages.length === 0 && "opacity-60"
        )}>
          <Textarea
            ref={inputRef}
            name="input"
            rows={2}
            maxRows={5}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={messages.length === 0 ? "Use the concept editor above to get started" : "ask me anything and I'll make it happen"}
            spellCheck={false}
            value={input}
            disabled={isLoading || isToolInvocationInProgress() || (messages.length === 0)}
            className="resize-none w-full min-h-12 bg-transparent border-0 p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Bottom menu area */}
          <div className="p-3 space-y-3">
            {/* Subtle divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Concept nodes */}
            <ConceptNodes />

            {/* Traditional controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditsIndicator />
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNewChat}
                    className="shrink-0 rounded-full group"
                    type="button"
                    disabled={isLoading || isToolInvocationInProgress()}
                  >
                    <MessageCirclePlus className="size-4 group-hover:rotate-12 transition-all" />
                  </Button>
                )}

                {/* Conditional Generate Concept Button */}
                {(() => {
                  // Check if enough key nodes have content
                  // For now, we'll use messages or expanded nodes as proxy for content
                  // In real implementation, this would check specific concept node content
                  const hasEnoughContent =
                    messages.length > 0 || input.length > 20

                  return hasEnoughContent ? (
                    <Button
                      type="button"
                      size="default"
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 group"
                      disabled={isLoading || isToolInvocationInProgress()}
                      onClick={() => {
                        // This would trigger the concept generation process
                        console.log(
                          'Generating concept with current node content...'
                        )
                      }}
                    >
                      <span className="group-hover:scale-105 transition-transform duration-200">
                        Generate Concept
                      </span>
                    </Button>
                  ) : (
                    <Button
                      type={isLoading ? 'button' : 'submit'}
                      size={'icon'}
                      variant={'outline'}
                      className={cn(
                        isLoading && 'animate-pulse',
                        'rounded-full'
                      )}
                      disabled={
                        (input.length === 0 && !isLoading) ||
                        isToolInvocationInProgress()
                      }
                      onClick={isLoading ? stop : undefined}
                    >
                      {isLoading ? <Square size={20} /> : <ArrowUp size={20} />}
                    </Button>
                  )
                })()}
              </div>
            </div>
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
      </form>
    </div>
  )
}
