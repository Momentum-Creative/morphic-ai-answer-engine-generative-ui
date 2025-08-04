'use client'

import { useNotifications } from '@/components/notification-context'

export function useNotificationActions() {
  const { addNotification } = useNotifications()

  const notifyTodoAdded = (taskName: string, projectName: string) => {
    addNotification({
      type: 'info',
      title: 'New To-Do Added',
      message: `A new task "${taskName}" was added to ${projectName}`,
      category: 'todo',
      relatedItem: projectName.toLowerCase().replace(/\s+/g, '-')
    })
  }

  const notifyTodoCompleted = (taskName: string, projectName: string) => {
    addNotification({
      type: 'success',
      title: 'Task Completed',
      message: `"${taskName}" was marked as complete in ${projectName}`,
      category: 'todo',
      relatedItem: projectName.toLowerCase().replace(/\s+/g, '-')
    })
  }

  const notifyProjectUpdated = (projectName: string, action: string) => {
    addNotification({
      type: 'info',
      title: 'Project Updated',
      message: `${projectName} was ${action}`,
      category: 'project',
      relatedItem: projectName.toLowerCase().replace(/\s+/g, '-')
    })
  }

  const notifyMediaAdded = (mediaType: string, count: number = 1) => {
    addNotification({
      type: 'success',
      title: 'Media Added',
      message: `${count} new ${mediaType} asset${count > 1 ? 's' : ''} added to your library`,
      category: 'media',
      relatedItem: mediaType
    })
  }

  const notifyConceptUpdated = (conceptName: string, details: string) => {
    addNotification({
      type: 'info',
      title: 'Concept Updated',
      message: `${conceptName} concept was updated: ${details}`,
      category: 'concept',
      relatedItem: conceptName.toLowerCase()
    })
  }

  const notifyCreditUsage = (used: number, total: number) => {
    const percentage = (used / total) * 100
    const type =
      percentage > 80 ? 'warning' : percentage > 90 ? 'error' : 'info'

    addNotification({
      type,
      title: 'Credit Usage Update',
      message: `You have used ${used} of ${total} credits (${Math.round(percentage)}% usage)`,
      category: 'system'
    })
  }

  const notifyError = (title: string, message: string) => {
    addNotification({
      type: 'error',
      title,
      message,
      category: 'system'
    })
  }

  const notifySuccess = (title: string, message: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      category: 'system'
    })
  }

  return {
    notifyTodoAdded,
    notifyTodoCompleted,
    notifyProjectUpdated,
    notifyMediaAdded,
    notifyConceptUpdated,
    notifyCreditUsage,
    notifyError,
    notifySuccess
  }
}
