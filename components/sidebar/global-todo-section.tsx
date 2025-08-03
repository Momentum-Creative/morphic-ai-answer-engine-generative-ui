'use client'

import { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  Filter,
  Bell,
  Clock,
  CheckCircle
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/components/notification-context'

interface TodoItem {
  id: string
  name: string
  completed: boolean
  projectName: string
  isNew?: boolean // Corresponds to unread notifications
}

type FilterType = 'new' | 'pending' | 'completed'

// Mock data - in real app this would come from API/database
const mockTodos: TodoItem[] = [
  {
    id: 't1',
    name: 'Finalize brand messaging',
    completed: false,
    projectName: 'My First Project',
    isNew: true
  },
  {
    id: 't2',
    name: 'Review video timeline',
    completed: true,
    projectName: 'My First Project'
  },
  {
    id: 't3',
    name: 'Get stakeholder approval',
    completed: false,
    projectName: 'My First Project'
  },
  {
    id: 't4',
    name: 'Create brand guidelines',
    completed: false,
    projectName: 'Brand Refresh 2024',
    isNew: true
  },
  {
    id: 't5',
    name: 'Upload logo assets',
    completed: true,
    projectName: 'Brand Refresh 2024'
  },
  {
    id: 't6',
    name: 'Schedule client review',
    completed: false,
    projectName: 'Summer Campaign'
  }
]

export function GlobalTodoSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('pending')
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos)
  const { notifications } = useNotifications()

  // Count unread todo notifications to determine "new" items
  const unreadTodoNotifications = notifications.filter(
    n => n.category === 'todo' && !n.read
  ).length

  // Filter todos based on active filter
  const filteredTodos = useMemo(() => {
    switch (activeFilter) {
      case 'new':
        return todos.filter(todo => todo.isNew && !todo.completed)
      case 'pending':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }, [todos, activeFilter])

  // Group todos by project
  const groupedTodos = useMemo(() => {
    const groups: Record<string, TodoItem[]> = {}
    filteredTodos.forEach(todo => {
      if (!groups[todo.projectName]) {
        groups[todo.projectName] = []
      }
      groups[todo.projectName].push(todo)
    })
    return groups
  }, [filteredTodos])

  const toggleTodo = (todoId: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed, isNew: false }
          : todo
      )
    )
  }

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case 'new':
        return <Bell className="w-3 h-3" />
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
    }
  }

  const getFilterCount = (filter: FilterType) => {
    switch (filter) {
      case 'new':
        return todos.filter(t => t.isNew && !t.completed).length
      case 'pending':
        return todos.filter(t => !t.completed).length
      case 'completed':
        return todos.filter(t => t.completed).length
    }
  }

  const totalPending = todos.filter(t => !t.completed).length
  const newCount = todos.filter(t => t.isNew && !t.completed).length

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="px-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-start gap-2 px-2 py-1.5 h-auto text-sm hover:bg-accent"
        >
          {isExpanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          <CheckSquare className="size-4 text-blue-500" />
          <span className="font-semibold text-foreground/80">To Do</span>

          {/* Badge showing pending count */}
          {totalPending > 0 && (
            <div className="ml-auto flex items-center gap-1">
              {newCount > 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                {totalPending}
              </span>
            </div>
          )}
        </Button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="ml-2 space-y-3">
          {/* Filter tabs - icon only with hover tooltips */}
          <div className="flex items-center gap-1 px-2">
            {(['new', 'pending', 'completed'] as FilterType[]).map(filter => {
              const count = getFilterCount(filter)
              const isActive = activeFilter === filter

              return (
                <div key={filter} className="relative group/filter">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      'h-7 px-2 text-xs flex items-center gap-1.5',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {getFilterIcon(filter)}
                    {count > 0 && (
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          isActive
                            ? 'bg-background text-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Button>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-popover border border-border rounded-md shadow-lg px-2 py-1 whitespace-nowrap">
                      <span className="text-xs font-medium capitalize">
                        {filter}
                      </span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Todo items grouped by project */}
          <div className="space-y-3">
            {Object.keys(groupedTodos).length === 0 ? (
              <div className="px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground">
                  {activeFilter === 'new' && 'No new tasks'}
                  {activeFilter === 'pending' && 'All tasks completed! 🎉'}
                  {activeFilter === 'completed' && 'No completed tasks'}
                </p>
              </div>
            ) : (
              Object.entries(groupedTodos).map(
                ([projectName, projectTodos]) => (
                  <div key={projectName} className="space-y-1">
                    {/* Project name */}
                    <div className="px-2">
                      <h5 className="text-xs font-medium text-muted-foreground">
                        {projectName}
                      </h5>
                    </div>

                    {/* Project todos */}
                    <div className="space-y-1">
                      {projectTodos.map(todo => (
                        <div key={todo.id} className="relative group/todo-item">
                          <div className="w-full flex items-center gap-2 px-4 py-1.5 h-auto text-sm hover:bg-accent/50 rounded-md">
                            {/* Checkbox - only this area toggles completion */}
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className="flex-shrink-0 hover:scale-110 transition-transform duration-200"
                            >
                              {todo.completed ? (
                                <CheckSquare className="w-4 h-4 text-green-500" />
                              ) : (
                                <Square className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                              )}
                            </button>

                            {/* Task text - non-clickable, expands on hover */}
                            <span
                              className={cn(
                                'flex-1 text-left transition-all duration-200',
                                todo.completed &&
                                  'line-through text-muted-foreground'
                              )}
                            >
                              <span className="truncate group-hover/todo-item:whitespace-normal group-hover/todo-item:break-words block">
                                {todo.name}
                              </span>
                            </span>

                            {/* New indicator */}
                            {todo.isNew && !todo.completed && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>

                          {/* Tooltip for very long text */}
                          {todo.name.length > 30 && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 group-hover/todo-item:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <div className="bg-popover border border-border rounded-md shadow-lg px-3 py-2 max-w-xs">
                                <span className="text-xs text-popover-foreground">
                                  {todo.name}
                                </span>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
