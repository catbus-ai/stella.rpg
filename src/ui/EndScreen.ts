export interface EarnedBadge {
  label: string
  image: string  // filename inside assets/images/
}

// ── Pig ear reveal — shown before beam-up ─────────────────────────────────
export function showPigEarReveal(onClose: () => void) {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 110;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Press Start 2P", monospace;
  `

  const card = document.createElement('div')
  card.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
    padding: 40px;
  `

  const label = document.createElement('p')
  label.style.cssText = `
    font-size: 9px;
    color: #ffaa00;
    letter-spacing: 2px;
    margin: 0;
  `
  label.textContent = '[ BADGE UNLOCKED ]'

  const img = document.createElement('img')
  img.src = 'assets/images/badge-pigear.png'
  img.alt = 'Pig Ear Champion'
  img.style.cssText = `
    width: 240px;
    height: 240px;
    object-fit: contain;
    image-rendering: pixelated;
    filter: drop-shadow(0 0 24px #ffaa0099);
    animation: badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  `

  const badgeName = document.createElement('p')
  badgeName.style.cssText = `
    font-size: 12px;
    color: #ffffff;
    margin: 0;
    line-height: 1.8;
  `
  badgeName.textContent = 'PIG EAR CHAMPION'

  const sublabel = document.createElement('p')
  sublabel.style.cssText = `
    font-size: 7px;
    color: #888888;
    margin: 0;
    line-height: 2;
  `
  sublabel.textContent = 'Earned for exceptional field work and one very large pig ear.'

  const hint = document.createElement('p')
  hint.style.cssText = `
    font-size: 7px;
    color: #555555;
    margin: 0;
    animation: blink 1.2s ease infinite;
  `
  hint.textContent = '[ CLICK OR SPACE TO CONTINUE ]'

  // Inject animations if not already present
  if (!document.getElementById('end-screen-style')) {
    const style = document.createElement('style')
    style.id = 'end-screen-style'
    style.textContent = `
      @keyframes badgePop {
        from { transform: scale(0.4); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.3; }
      }
    `
    document.head.appendChild(style)
  }

  card.appendChild(label)
  card.appendChild(img)
  card.appendChild(badgeName)
  card.appendChild(sublabel)
  card.appendChild(hint)
  overlay.appendChild(card)
  document.body.appendChild(overlay)

  const dismiss = () => {
    overlay.remove()
    window.removeEventListener('keydown', onKey)
    onClose()
  }
  const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') dismiss() }
  overlay.addEventListener('click', dismiss)
  window.addEventListener('keydown', onKey)
}

// ── End screen — badges showcase ──────────────────────────────────────────
export function showEndScreen(badges: EarnedBadge[]) {
  // Shared hover preview element
  const preview = document.createElement('div')
  preview.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 999;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: #0d0d1a;
    border: 3px solid #ffaa00;
    padding: 16px;
    box-shadow: 0 0 32px #ffaa0066;
  `
  const previewImg = document.createElement('img')
  previewImg.style.cssText = `
    width: 200px;
    height: 200px;
    object-fit: contain;
    image-rendering: pixelated;
  `
  const previewLabel = document.createElement('div')
  previewLabel.style.cssText = `
    font-family: "Press Start 2P", monospace;
    font-size: 8px;
    color: #ffaa00;
    text-align: center;
    line-height: 1.8;
  `
  preview.appendChild(previewImg)
  preview.appendChild(previewLabel)
  document.body.appendChild(preview)

  function positionPreview(e: MouseEvent) {
    const pw = 232, ph = 260, pad = 12
    let x = e.clientX + pad
    let y = e.clientY - ph - pad
    if (x + pw > window.innerWidth) x = e.clientX - pw - pad
    if (y < 0)                      y = e.clientY + pad
    preview.style.left = `${x}px`
    preview.style.top  = `${y}px`
  }

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #000000;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Press Start 2P", monospace;
  `

  const card = document.createElement('div')
  card.style.cssText = `
    background: #0a0a14;
    border: 3px solid #ffff00;
    padding: 36px 40px;
    max-width: 680px;
    width: 94%;
    max-height: 90vh;
    overflow-y: auto;
    text-align: center;
    color: #ffffff;
  `

  card.innerHTML = `
    <p style="font-size:8px; color:#ffff00; letter-spacing:2px; margin-bottom:10px;">
      [ MISSION DEBRIEF ]
    </p>
    <h1 style="font-size:14px; color:#ffffff; margin:0 0 6px 0; line-height:1.8;">
      CHAPTER 1 COMPLETE
    </h1>
    <p style="font-size:7px; color:#888888; margin-bottom:28px; line-height:2;">
      Los Angeles Wildfire — January 2025
    </p>
  `

  // Badge grid with hover zoom
  const badgeGrid = document.createElement('div')
  badgeGrid.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    margin-bottom: 28px;
  `

  badges.forEach((b) => {
    const item = document.createElement('div')
    item.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 120px;
    `

    const img = document.createElement('img')
    img.src = `assets/images/${b.image}`
    img.alt = b.label
    img.style.cssText = `
      width: 96px;
      height: 96px;
      object-fit: contain;
      image-rendering: pixelated;
      filter: drop-shadow(0 0 8px #ffaa0066);
      cursor: zoom-in;
      transition: transform 0.15s ease;
    `

    img.addEventListener('mouseenter', (e) => {
      img.style.transform = 'scale(1.15)'
      previewImg.src = img.src
      previewLabel.textContent = b.label
      preview.style.display = 'flex'
      positionPreview(e)
    })
    img.addEventListener('mousemove', positionPreview)
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)'
      preview.style.display = 'none'
    })

    const labelEl = document.createElement('p')
    labelEl.style.cssText = `
      font-size: 6px;
      color: #ffaa00;
      line-height: 1.8;
      margin: 0;
      text-align: center;
    `
    labelEl.textContent = b.label

    item.appendChild(img)
    item.appendChild(labelEl)
    badgeGrid.appendChild(item)
  })

  card.appendChild(badgeGrid)

  const summary = document.createElement('div')
  summary.style.cssText = `
    background: #0a1a0a;
    border-left: 4px solid #00ff88;
    padding: 12px 16px;
    font-size: 7px;
    line-height: 2.2;
    color: #aaffaa;
    text-align: left;
    margin-bottom: 28px;
  `
  summary.innerHTML = `
    <strong style="color:#00ff88;">MISSION SUMMARY:</strong><br>
    Damage zones identified. Intact structures confirmed.<br>
    Vegetation coverage mapped. Classification complete.<br>
    Data uploaded to the science team.
  `
  card.appendChild(summary)

  const takeaway = document.createElement('p')
  takeaway.style.cssText = `
    font-size: 7px;
    color: #aaaaff;
    line-height: 2.2;
    margin-bottom: 28px;
  `
  takeaway.textContent =
    'SAR satellites image through smoke and night. ' +
    'Strong backscatter = standing walls. ' +
    'Dark fuzzy patches = fire damage. ' +
    'Volume scatter = forest.'
  card.appendChild(takeaway)

  const replayBtn = document.createElement('button')
  replayBtn.style.cssText = `
    display: block;
    width: 100%;
    background: #ffff00;
    color: #000000;
    border: none;
    padding: 14px;
    font-family: "Press Start 2P", monospace;
    font-size: 10px;
    cursor: pointer;
    letter-spacing: 1px;
    margin-bottom: 10px;
  `
  replayBtn.textContent = '[ PLAY AGAIN ]'
  replayBtn.addEventListener('click', () => {
    preview.remove()
    overlay.remove()
    window.location.reload()
  })
  card.appendChild(replayBtn)

  overlay.appendChild(card)
  document.body.appendChild(overlay)
}
