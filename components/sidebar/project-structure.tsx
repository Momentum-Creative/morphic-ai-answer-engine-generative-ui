'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Music,
  Mic,
  Volume2,
  Video,
  Image,
  Plus,
  Tag,
  Zap,
  DollarSign
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MediaItem {
  id: string
  name: string
  type: 'music' | 'dialogue' | 'narration' | 'video' | 'image'
}

interface FolderState {
  isExpanded: boolean
  items: MediaItem[]
}

const getMediaIcon = (type: MediaItem['type']) => {
  switch (type) {
    case 'music':
      return <Music className="size-4 text-purple-500" />
    case 'dialogue':
      return <Mic className="size-4 text-blue-500" />
    case 'narration':
      return <Volume2 className="size-4 text-green-500" />
    case 'video':
      return <Video className="size-4 text-red-500" />
    case 'image':
      return <Image className="size-4 text-orange-500" />
  }
}

export function ProjectStructure() {
  const [folders, setFolders] = useState<Record<string, FolderState>>({
    briefs: {
      isExpanded: false,
      items: [
        { id: '1', name: 'Brand Guidelines', type: 'image' },
        { id: '2', name: 'Creative Brief.pdf', type: 'image' }
      ]
    },
    media: {
      isExpanded: false,
      items: [
        { id: '3', name: 'Background Music.mp3', type: 'music' },
        { id: '4', name: 'Voiceover Script', type: 'dialogue' },
        { id: '5', name: 'Hero Video.mp4', type: 'video' },
        { id: '6', name: 'Product Shot.jpg', type: 'image' }
      ]
    },
    reference: {
      isExpanded: false,
      items: [
        { id: '7', name: 'Competitor Analysis', type: 'image' },
        { id: '8', name: 'Style References', type: 'image' }
      ]
    }
  })

  const toggleFolder = (folderKey: string) => {
    setFolders(prev => ({
      ...prev,
      [folderKey]: {
        ...prev[folderKey],
        isExpanded: !prev[folderKey].isExpanded
      }
    }))
  }

  const folderConfigs = [
    { key: 'briefs', name: 'Briefs', icon: FileText },
    { key: 'media', name: 'Media', icon: Folder },
    { key: 'reference', name: 'Reference', icon: Folder }
  ]

  return (
    <div className="space-y-2">
      {/* Project Header */}
      <div className="px-2 py-2">
        <h3 className="text-sm font-semibold text-foreground/80 mb-3">My Project</h3>
      </div>

      {/* Folder Structure */}
      <div className="space-y-1">
        {folderConfigs.map(({ key, name, icon: Icon }) => {
          const folder = folders[key]
          const isExpanded = folder?.isExpanded || false

          return (
            <div key={key} className="space-y-1">
              {/* Folder Header */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFolder(key)}
                className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent"
              >
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
                {isExpanded ? (
                  <FolderOpen className="size-4 text-blue-500" />
                ) : (
                  <Icon className="size-4 text-blue-500" />
                )}
                <span>{name}</span>
                <Plus className="size-3 ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground" />
              </Button>

              {/* Folder Contents */}
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {folder.items.map(item => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent/50"
                    >
                      {getMediaIcon(item.type)}
                      <span className="truncate">{item.name}</span>
                    </Button>
                  ))}
                  
                  {/* Add new item button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm text-muted-foreground hover:bg-accent/50"
                  >
                    <Plus className="size-4" />
                    <span>Add {name.toLowerCase()}</span>
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Media Type Legend */}
      <div className="px-2 py-4 border-t border-border/50 mt-6">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Media Types</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <Music className="size-3 text-purple-500" />
            <span className="text-muted-foreground">Music</span>
          </div>
          <div className="flex items-center gap-1">
            <Mic className="size-3 text-blue-500" />
            <span className="text-muted-foreground">Dialogue</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="size-3 text-green-500" />
            <span className="text-muted-foreground">Narration</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="size-3 text-red-500" />
            <span className="text-muted-foreground">Video</span>
          </div>
          <div className="flex items-center gap-1">
            <Image className="size-3 text-orange-500" />
            <span className="text-muted-foreground">Image</span>
          </div>
        </div>
      </div>
    </div>
  )
}
