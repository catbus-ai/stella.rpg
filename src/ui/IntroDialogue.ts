// DOM-based intro dialogue — guaranteed crisp text regardless of canvas scaling.
// The Phaser scene handles background/animation; this handles all readable text.

import { PORTRAITS } from '../data/portraits'

export interface DialogueStep {
  speaker: string
  portrait: string  // any key from src/data/portraits.ts
  lines: string[]
}

let overlay: HTMLDivElement | null = null
let onAdvanceCallback: (() => void) | null = null

export function showIntroDialogue(step: DialogueStep, onAdvance: () => void) {
  removeIntroDialogue()
  onAdvanceCallback = onAdvance

  overlay = document.createElement('div')
  overlay.id = 'intro-dialogue'

  const def = PORTRAITS[step.portrait] ?? PORTRAITS['shay']
  const border      = def.borderColor
  const nameColor   = def.nameColor
  const portraitSrc = `assets/images/${def.file}`

  overlay.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    width: min(780px, 96vw);
    background: rgba(2, 8, 20, 0.96);
    border: 3px solid ${border};
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0;
    z-index: 100;
    box-shadow: 0 0 24px ${border}44;
    font-family: "Press Start 2P", monospace;
    image-rendering: pixelated;
  `

  // Portrait column
  const portCol = document.createElement('div')
  portCol.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    min-width: 110px;
    border-right: 2px solid ${border}66;
  `

  const img = document.createElement('img')
  img.src = portraitSrc
  img.alt = step.speaker
  img.style.cssText = `
    width: 90px;
    height: 90px;
    object-fit: contain;
    image-rendering: pixelated;
  `

  portCol.appendChild(img)
  overlay.appendChild(portCol)

  // Text column
  const textCol = document.createElement('div')
  textCol.style.cssText = `
    flex: 1;
    padding: 16px 20px 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `

  // Speaker name
  const nameEl = document.createElement('div')
  nameEl.style.cssText = `
    font-size: 11px;
    color: ${nameColor};
    letter-spacing: 1px;
    margin-bottom: 4px;
  `
  nameEl.textContent = step.speaker
  textCol.appendChild(nameEl)

  // Divider
  const divider = document.createElement('div')
  divider.style.cssText = `height: 1px; background: ${border}44; margin-bottom: 4px;`
  textCol.appendChild(divider)

  // Lines — staggered fade-in
  const linesEl = document.createElement('div')
  linesEl.style.cssText = `display: flex; flex-direction: column; gap: 8px;`

  step.lines.forEach((line, i) => {
    const p = document.createElement('p')
    p.style.cssText = `
      margin: 0;
      font-size: 11px;
      line-height: 1.9;
      color: #eeeeee;
      opacity: 0;
      transition: opacity 0.3s ease;
      min-height: 1em;
    `
    p.textContent = line || '\u00A0' // non-breaking space for blank lines
    linesEl.appendChild(p)

    setTimeout(() => { p.style.opacity = '1' }, i * 180)
  })

  textCol.appendChild(linesEl)

  // Advance hint — appears after all lines fade in
  const hint = document.createElement('div')
  hint.style.cssText = `
    font-size: 8px;
    color: #555555;
    text-align: right;
    margin-top: 8px;
    opacity: 0;
    transition: opacity 0.4s ease;
    animation: blink 1.2s ease infinite;
  `
  hint.textContent = '[ SPACE or CLICK to continue ]'
  textCol.appendChild(hint)

  const hintDelay = step.lines.length * 180 + 400
  setTimeout(() => { hint.style.opacity = '1' }, hintDelay)

  overlay.appendChild(textCol)
  document.body.appendChild(overlay)

  // Inject blink keyframe if not already present
  if (!document.getElementById('intro-blink-style')) {
    const style = document.createElement('style')
    style.id = 'intro-blink-style'
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `
    document.head.appendChild(style)
  }

  // Click anywhere on overlay to advance
  overlay.addEventListener('click', triggerAdvance)
}

export function triggerAdvance() {
  if (!onAdvanceCallback) return
  const cb = onAdvanceCallback
  onAdvanceCallback = null
  removeIntroDialogue()
  cb()
}

export function removeIntroDialogue() {
  if (overlay) { overlay.remove(); overlay = null }
  onAdvanceCallback = null
}
