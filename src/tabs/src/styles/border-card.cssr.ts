import { c, cB, cM, cNotM } from '../../../_utils/cssr'

export default cM('border-card-type', `
  border: 1px solid var(--n-tab-border-color);
  background-color: var(--n-border-card-color);
`, [
  cB('tab-pane', 'box-sizing: border-box;'),
  c('>', [
    cB('tabs-nav', `
      background-color: var(--n-border-card-header-color);
      transition: background-color .3s var(--n-bezier);
    `, [
      cM('border-card-type', [
        cB('tabs-tab', `
        border-radius: 0;
        background-color: transparent;
        border: 1px solid transparent;
      `, [
          cM('active', `
          background-color: var(--n-border-card-color);
          border-inline-color: var(--n-tab-border-color);
        `),
          cNotM('disabled', [
            c('&:hover', 'color: var(--n-bar-color);')
          ])
        ]),
        cB('tabs-fixed', [
          cB('tabs-tab', [cM('active', 'box-shadow: none;')])
        ])
      ])
    ])
  ]),
  ...(['top', 'bottom', 'left', 'right'] as const).map((placement) => {
    const edge = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[placement]
    return cM(placement, [
      c('>', [
        cB('tabs-nav', [
          cB('tabs-tab', `border-${edge}-color: var(--n-tab-border-color);`, [
            cM('active', `border-${edge}-color: transparent;`)
          ]),
          cB('tabs-tab-pad', `border-${edge}-color: var(--n-tab-border-color);`)
        ])
      ])
    ])
  })
])
