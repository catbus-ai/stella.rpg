import { virtualInput } from '../input/virtualInput'

type Dir = 'up' | 'down' | 'left' | 'right'

const LABELS: Record<Dir, string> = {
  up: '▲', down: '▼', left: '◀', right: '▶',
}

export class TouchControls {
  private container: HTMLDivElement

  constructor() {
    this.container = document.createElement('div')
    this.container.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 24px;
      display: grid;
      grid-template-columns: repeat(3, 56px);
      grid-template-rows: repeat(3, 56px);
      gap: 4px;
      z-index: 30;
      user-select: none;
      -webkit-user-select: none;
    `

    // Grid positions: [col, row] (1-indexed)
    const layout: Array<[Dir, number, number]> = [
      ['up',    2, 1],
      ['left',  1, 2],
      ['right', 3, 2],
      ['down',  2, 3],
    ]

    layout.forEach(([dir, col, row]) => {
      const btn = this.makeButton(dir)
      btn.style.gridColumn = String(col)
      btn.style.gridRow    = String(row)
      this.container.appendChild(btn)
    })

    document.body.appendChild(this.container)
  }

  private makeButton(dir: Dir): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.textContent = LABELS[dir]
    btn.setAttribute('aria-label', dir)
    btn.style.cssText = `
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid rgba(255, 255, 0, 0.4);
      border-radius: 8px;
      color: rgba(255, 255, 0, 0.8);
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.05s, border-color 0.05s;
    `

    const press = (e: Event) => {
      e.preventDefault()
      virtualInput[dir] = true
      btn.style.background   = 'rgba(255, 255, 0, 0.25)'
      btn.style.borderColor  = 'rgba(255, 255, 0, 0.9)'
    }
    const release = (e: Event) => {
      e.preventDefault()
      virtualInput[dir] = false
      btn.style.background  = 'rgba(255, 255, 255, 0.12)'
      btn.style.borderColor = 'rgba(255, 255, 0, 0.4)'
    }

    btn.addEventListener('touchstart',  press,   { passive: false })
    btn.addEventListener('touchend',    release, { passive: false })
    btn.addEventListener('touchcancel', release, { passive: false })
    btn.addEventListener('mousedown',   press)
    btn.addEventListener('mouseup',     release)
    btn.addEventListener('mouseleave',  release)

    return btn
  }

  destroy() {
    // Clear any held directions so Stella doesn't keep moving
    virtualInput.up = virtualInput.down = virtualInput.left = virtualInput.right = false
    this.container.remove()
  }
}
