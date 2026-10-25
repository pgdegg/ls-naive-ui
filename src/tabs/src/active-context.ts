import type { ComputedRef, InjectionKey } from 'vue'

export interface TabPaneActiveContext {
  selfActive: ComputedRef<boolean>
  active: ComputedRef<boolean>
  path: ComputedRef<string>
}

export const tabPaneActiveContextKey: InjectionKey<TabPaneActiveContext>
  = Symbol('n-tab-pane-active')
