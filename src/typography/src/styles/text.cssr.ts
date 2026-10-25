import { cB, cM } from '../../../_utils/cssr'

// 变量：
// --n-text-color
// --n-font-weight-strong
// --n-font-famliy-mono
// --n-code-border-radius
// --n-code-text-color
// --n-code-color
// --n-code-border
export default cB('text', `
  transition: color .3s var(--n-bezier);
  color: var(--n-text-color);
`, [
  cM('truncated', { display: 'inline-block', maxWidth: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' }),
  cM('strong', `
    font-weight: var(--n-font-weight-strong);
  `),
  cM('italic', {
    fontStyle: 'italic'
  }),
  cM('underline', {
    textDecoration: 'underline'
  }),
  cM('code', `
    line-height: 1.4;
    display: inline-block;
    font-family: var(--n-font-famliy-mono);
    transition: 
      color .3s var(--n-bezier),
      border-color .3s var(--n-bezier),
      background-color .3s var(--n-bezier);
    box-sizing: border-box;
    padding: .05em .35em 0 .35em;
    border-radius: var(--n-code-border-radius);
    font-size: .9em;
    color: var(--n-code-text-color);
    background-color: var(--n-code-color);
    border: var(--n-code-border);
  `),
  cM('sized', { fontSize: 'var(--n-text-font-size)' }),
  cM('clamped', { display: '-webkit-box', maxWidth: '100%', minWidth: 0, overflow: 'hidden', WebkitBoxOrient: 'vertical', whiteSpace: 'normal', overflowWrap: 'anywhere' })
])
