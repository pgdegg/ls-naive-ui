import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export type ContentStyleTarget = 'value' | 'label' | 'placeholder'
export type ContentStyleTargets
  = ContentStyleTarget | ContentStyleTarget[] | undefined

export function useContentStyle(
  highlight: MaybeRefOrGetter<ContentStyleTargets>,
  zoom: MaybeRefOrGetter<ContentStyleTargets>
) {
  const classes = (targets: ContentStyleTargets, prefix: string): string =>
    (Array.isArray(targets) ? targets : targets ? [targets] : [])
      .map(target => `${prefix}__${target}`)
      .join(' ')
  return {
    highlightText: computed(() => classes(toValue(highlight), 'bold-content')),
    zoomText: computed(() => classes(toValue(zoom), 'zoom-content'))
  }
}
