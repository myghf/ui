export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'secondary'

export interface ToneClasses {
  soft: string
  outline: string
  icon: string
  role: 'alert' | 'status'
}

export const toneClasses: Record<Tone, ToneClasses> = {
  info: {
    soft: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200',
    outline: 'border border-primary-300 text-primary-800 dark:border-primary-700 dark:text-primary-200',
    icon: 'text-primary-500 dark:text-primary-300',
    role: 'status',
  },
  success: {
    soft: 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-200',
    outline: 'border border-success-300 text-success-800 dark:border-success-700 dark:text-success-200',
    icon: 'text-success-500 dark:text-success-300',
    role: 'status',
  },
  warning: {
    soft: 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-200',
    outline: 'border border-warning-300 text-warning-800 dark:border-warning-700 dark:text-warning-200',
    icon: 'text-warning-500 dark:text-warning-300',
    role: 'alert',
  },
  danger: {
    soft: 'bg-error-100 text-error-800 dark:bg-error-900/40 dark:text-error-200',
    outline: 'border border-error-300 text-error-800 dark:border-error-700 dark:text-error-200',
    icon: 'text-error-500 dark:text-error-300',
    role: 'alert',
  },
  secondary: {
    soft: 'bg-surface-muted text-foreground',
    outline: 'border border-border text-foreground',
    icon: 'text-muted',
    role: 'status',
  },
}
