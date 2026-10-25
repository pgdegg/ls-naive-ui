import { c, cB, cM } from '../../../_utils/cssr'

export default c([
  cB('input-number', [cM('rtl', [cB('input-number-stepper', { marginInlineEnd: 'calc(1px - var(--n-padding-left))' })])]),
  cB('input-number-stepper', `
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: clamp(22px, calc(var(--n-height) * .8), 30px);
    height: calc(var(--n-height) - 2px);
    margin-inline-end: calc(1px - var(--n-padding-right));
    box-sizing: border-box;
    border-inline-start: var(--n-border);
    background-color: transparent;
    overflow: hidden;
  `, [
    c('&::after', `
      content: "";
      position: absolute;
      inset-inline: 0;
      top: 50%;
      border-top: var(--n-border);
      pointer-events: none;
    `),
    cB('button', `
      flex: 1;
      width: 100%;
      height: 50%;
      min-height: 0;
      padding: 0;
      border-radius: 0;
      margin: 0;
    `)
  ]),
  cB('input-number-suffix', `
    display: inline-block;
    margin-right: 10px;
  `),
  cB('input-number-prefix', `
    display: inline-block;
    margin-left: 10px;
  `)
])
