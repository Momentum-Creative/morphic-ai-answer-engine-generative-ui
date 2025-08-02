'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  category: 'todo' | 'project' | 'media' | 'concept' | 'system'
  relatedItem?: string
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    )
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'New To-Do Added',
      message:
        'A new task "Finalize brand messaging" was added to My First Project',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      category: 'todo',
      relatedItem: 'my-first-project',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Project Updated',
      message: 'Media library successfully updated with new Brand Media assets',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      category: 'media',
      relatedItem: 'brand-media',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Credit Usage',
      message: 'You have used 120 of 500 credits (24% usage)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      category: 'system',
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (
    notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
