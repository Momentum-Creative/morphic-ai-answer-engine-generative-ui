import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

const exampleMessages = [
  {
    heading: 'What kind of campaign themes would resonate best with Gen Z on TikTok for this project',
    message: 'What kind of campaign themes would resonate best with Gen Z on TikTok for this project'
  },
  {
    heading: 'Can you generate a moodboard that fits our brand guidelines?',
    message: 'Can you generate a moodboard that fits our brand guidelines?'
  },
  {
    heading: 'Give me a few high-concept ideas that combine humor and social proof.',
    message: 'Give me a few high-concept ideas that combine humor and social proof.'
  },
  {
    heading: 'Turn this idea into a short script and visual outline.',
    message: 'Turn this idea into a short script and visual outline.'
  },
  {
    heading: 'Can you help me brainstorm a funny video idea about remote work?',
    message: 'Can you help me brainstorm a funny video idea about remote work?'
  },
  {
    heading: 'Can you co-write an opening line that hooks the viewer in 3 seconds?',
    message: 'Can you co-write an opening line that hooks the viewer in 3 seconds?'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background/70 backdrop-blur-sm p-4 rounded-2xl border border-border/30">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-2 text-sm text-left justify-start hover:bg-background/50 rounded-lg transition-colors w-full"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
