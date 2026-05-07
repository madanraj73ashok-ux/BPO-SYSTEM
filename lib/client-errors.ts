'use client'

import { toast } from '@/hooks/use-toast'

export function showErrorToast(title: string, error: unknown) {
  toast({
    title,
    description:
      error instanceof Error
        ? error.message
        : 'Please try again or check your MongoDB connection.',
    variant: 'destructive',
  })
}
