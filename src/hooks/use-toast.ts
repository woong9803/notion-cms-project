import { toast } from 'sonner'

export interface ToastParams {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

/**
 * sonner 토스트를 래핑한 커스텀 훅
 */
export function useToast() {
  return {
    toast: (params: ToastParams) => {
      const { title, description, variant = 'default' } = params
      const message = title
        ? description
          ? `${title}\n${description}`
          : title
        : description

      if (variant === 'destructive') {
        toast.error(message)
      } else {
        toast.success(message)
      }
    },
  }
}
