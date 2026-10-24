import type { InjectionKey } from 'vue'
import type { KeyboardInteractiveInjection } from './interface'

export const keyboardInteractiveInjectionKey: InjectionKey<KeyboardInteractiveInjection>
  = Symbol('n-keyboard-interactive')
