import { c, cB, cM, cNotM } from '../../../_utils/cssr'

export default cM('card-group-type', [
  c('>', [
    cB('tabs-nav', [cM('card-group-type', [
      cB('tabs-tab', `
        border: 0;
        border-radius: 0;
        background-color: transparent;
      `, [cNotM('disabled', [c('&:hover', 'color: var(--n-bar-color);')])]),
      cB('tabs-tab-pad', 'width: 0; height: 0; border: 0;'),
      cB('tabs-wrapper', 'border: 1px solid var(--n-tab-border-color); overflow: hidden;')
    ])])
  ]),
  ...(['top', 'bottom', 'left', 'right'] as const).map((placement) => {
    const edge = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[placement]
    const radius = {
      top: 'var(--n-tab-border-radius) var(--n-tab-border-radius) 0 0',
      bottom: '0 0 var(--n-tab-border-radius) var(--n-tab-border-radius)',
      left: 'var(--n-tab-border-radius) 0 0 var(--n-tab-border-radius)',
      right: '0 var(--n-tab-border-radius) var(--n-tab-border-radius) 0'
    }[placement]
    const separator = placement === 'top' || placement === 'bottom' ? 'inline-end' : 'bottom'
    return cM(placement, [c('>', [cB('tabs-nav', [cM('card-group-type', [
      cB('tabs-wrapper', `border-${edge}: 0; border-radius: ${radius};`),
      cB('tabs-tab', `border-${edge}: 1px solid var(--n-tab-border-color);`, [
        cM('active', `border-${edge}-color: transparent;`)
      ]),
      cB('tabs-tab-wrapper', [c('&:not(:last-child)', [cB('tabs-tab', `border-${separator}: 1px solid var(--n-tab-border-color);`)])])
    ])])])])
  })
])
