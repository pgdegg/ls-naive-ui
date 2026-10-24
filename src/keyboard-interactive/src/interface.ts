import type { Ref } from 'vue'

export interface KeyboardInteractiveEnterContext {
  event: KeyboardEvent
  current: HTMLElement
  next: HTMLElement | null
}

export type KeyboardInteractiveFocusTarget
  = 'first' | 'last' | 'prev' | 'next' | string | HTMLElement | { field: string }

export interface KeyboardInteractiveInst {
  readonly currentFocused: HTMLElement | null
  readonly previousFocused: HTMLElement | null
  readonly nextFocused: HTMLElement | null
  focus: (
    target: KeyboardInteractiveFocusTarget,
    direction?: 'next' | 'prev',
    rowId?: string
  ) => Promise<void>
}

export interface KeyboardInteractiveItemRegistration {
  element: Ref<HTMLElement | null>
  getOptions: () => {
    order?: number
    ignore?: boolean
    path?: string
    rowId?: string
    value?: unknown
    validate?: () => boolean | Promise<boolean>
  }
}

export interface KeyboardInteractiveFormRegistration {
  element: Ref<HTMLElement | null>
  getPath: () => string | undefined
  validate: () => Promise<boolean>
}

export interface KeyboardInteractiveInjection {
  handleKeyup: (event: KeyboardEvent) => Promise<void>
  registerItem: (item: KeyboardInteractiveItemRegistration) => () => void
  registerFormItem: (item: KeyboardInteractiveFormRegistration) => () => void
}
