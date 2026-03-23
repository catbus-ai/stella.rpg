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

  const def = PORTRAITS[step.portrait] ?? PORTRAITS['shay']
  const border      = def.borderColor
  const nameColor   = def.nameColor
  const portraitSrc = `assets/images/${def.file}`

  overlay.id = 'intro-dialogue-overlay'
  overlay.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    width: min(780px, 96vw);
    max-height: calc(100dvh - 48px);
    overflow: hidden;
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
  portCol.id = 'intro-portrait-col'
  portCol.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 16px 12px;
    padding-top: 20px;
    min-width: 110px;
    border-right: 2px solid ${border}66;
    flex-shrink: 0;
  `

  const img = document.createElement('img')
  img.id = 'intro-portrait-img'
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

  // Text column — this is the scrollable part
  const textCol = document.createElement('div')
  textCol.id = 'intro-text-col'
  textCol.style.cssText = `
    flex: 1;
    padding: 16px 20px 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `

  // Speaker name
  const nameEl = document.createElement('div')
  nameEl.id = 'intro-speaker-name'
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
  linesEl.id = 'intro-lines'
  linesEl.style.cssText = `display: flex; flex-direction: column; gap: 8px;`

  step.lines.forEach((line, i) => {
    const p = document.createElement('p')
    p.className = 'intro-line'
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
  hint.textContent = '[ SPACE / TAP to continue ]'
  textCol.appendChild(hint)

  const hintDelay = step.lines.length * 180 + 400
  setTimeout(() => { hint.style.opacity = '1' }, hintDelay)

  overlay.appendChild(textCol)
  document.body.appendChild(overlay)

  // Inject blink keyframe + responsive styles if not already present
  if (!document.getElementById('intro-blink-style')) {
    const style = document.createElement('style')
    style.id = 'intro-blink-style'
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @media (max-height: 500px) {
        #intro-dialogue-overlay {
          bottom: 8px;
        }
        #intro-portrait-col {
          padding: 8px;
          padding-top: 12px;
          min-width: 72px;
        }
        #intro-portrait-img {
          width: 55px !important;
          height: 55px !important;
        }
        #intro-text-col {
          padding: 8px 12px;
          gap: 4px;
        }
        #intro-speaker-name {
          font-size: 8px !important;
          margin-bottom: 2px;
        }
        #intro-lines {
          gap: 3px;
        }
        .intro-line {
          font-size: 8px !important;
          line-height: 1.6 !important;
        }
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
