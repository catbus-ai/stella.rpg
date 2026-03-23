let activeOverlay: HTMLDivElement | null = null

export function showInstructionsPopup() {
  if (activeOverlay) return

  activeOverlay = document.createElement('div')
  activeOverlay.style.cssText = `
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.82);
    display: flex; align-items: center; justify-content: center;
    font-family: "Press Start 2P", monospace;
  `

  const box = document.createElement('div')
  box.style.cssText = `
    background: #0a0a14;
    border: 3px solid #ffff00;
    padding: 32px 36px;
    max-width: 520px;
    width: 92%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  `

  const title = document.createElement('p')
  title.style.cssText = `font-size: 11px; color: #ffff00; margin: 0; letter-spacing: 2px;`
  title.textContent = '[ HOW TO PLAY ]'

  const section = (heading: string, color: string, rows: [string, string][]) => {
    const wrap = document.createElement('div')
    wrap.style.cssText = `display: flex; flex-direction: column; gap: 10px;`

    const h = document.createElement('p')
    h.style.cssText = `font-size: 7px; color: ${color}; margin: 0; letter-spacing: 1px;`
    h.textContent = heading
    wrap.appendChild(h)

    const divider = document.createElement('div')
    divider.style.cssText = `height: 1px; background: ${color}44;`
    wrap.appendChild(divider)

    rows.forEach(([key, desc]) => {
      const row = document.createElement('div')
      row.style.cssText = `display: flex; gap: 16px; align-items: baseline;`

      const k = document.createElement('span')
      k.style.cssText = `
        font-size: 8px; color: #ffffff; min-width: 140px;
        background: #1a1a2e; padding: 4px 8px; flex-shrink: 0;
      `
      k.textContent = key

      const d = document.createElement('span')
      d.style.cssText = `font-size: 7px; color: #aaaaaa; line-height: 2;`
      d.textContent = desc

      row.appendChild(k)
      row.appendChild(d)
      wrap.appendChild(row)
    })

    return wrap
  }

  box.appendChild(title)
  box.appendChild(section('MOVEMENT', '#ffff00', [
    ['↑ ↓ ← →  /  WASD', 'Move Stella around the map'],
    ['D-PAD (mobile)', 'Tap the on-screen arrows'],
  ]))
  box.appendChild(section('EXPLORATION', '#88aaff', [
    ['Yellow  ?  marker', 'Discovery point — walk up to investigate'],
    ['Orange  !  marker', 'Classification challenge — identify the scene'],
    ['Compass arrow', 'Points toward the next objective'],
  ]))
  box.appendChild(section('CONTROLS', '#aaffaa', [
    ['SPACE / TAP', 'Advance dialogue'],
    ['ESC', 'Quit to chapter select'],
    ['[ ? ] button', 'Show this screen'],
  ]))

  const hint = document.createElement('p')
  hint.style.cssText = `
    font-size: 7px; color: #555555; margin: 0; text-align: center;
    animation: blink 1.2s ease infinite;
  `
  hint.textContent = '[ CLICK OR PRESS ESC TO CLOSE ]'
  box.appendChild(hint)

  activeOverlay.appendChild(box)
  document.body.appendChild(activeOverlay)

  const close = () => {
    if (!activeOverlay) return
    activeOverlay.remove()
    activeOverlay = null
    window.removeEventListener('keydown', onKey)
  }
  const onKey = (e: KeyboardEvent) => { if (e.code === 'Escape' || e.code === 'Space') close() }
  activeOverlay.addEventListener('click', close)
  window.addEventListener('keydown', onKey)
}
