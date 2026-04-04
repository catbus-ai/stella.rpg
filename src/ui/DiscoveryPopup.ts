import { DiscoveryData } from '../data/discoveryPoints'

export function showDiscoveryPopup(data: DiscoveryData, onClose: () => void) {
  // Overlay backdrop
  const backdrop = document.createElement('div')
  backdrop.id = 'discovery-backdrop'
  backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  // Popup card
  const card = document.createElement('div')
  card.style.cssText = `
    background: #0d0d1a;
    border: 3px solid #ffff00;
    padding: 28px 32px;
    max-width: 540px;
    width: 92%;
    max-height: 85vh;
    overflow-y: auto;
    font-family: "Press Start 2P", monospace;
    color: #ffffff;
    image-rendering: pixelated;
    position: relative;
  `

  // SAR label
  const sarLabel = document.createElement('p')
  sarLabel.style.cssText = `
    font-size: 8px;
    color: #ffff00;
    margin-bottom: 6px;
    letter-spacing: 2px;
  `
  sarLabel.textContent = '[ SAR IMAGE ]'

  // Title
  const title = document.createElement('h2')
  title.style.cssText = `
    font-size: 16px;
    color: #ffff00;
    margin: 0 0 16px 0;
    line-height: 1.6;
  `
  title.textContent = data.title

  // SAR description chip
  const sarChip = document.createElement('div')
  sarChip.style.cssText = `
    background: #1a1a3a;
    border: 1px solid #444488;
    padding: 8px 12px;
    font-size: 10px;
    color: #aaaaff;
    margin-bottom: 16px;
    line-height: 1.8;
  `
  sarChip.textContent = `${data.sarDescription}`

  // Image comparison section
  const hasSar     = !!data.sarImageUrl
  const hasOptical = !!data.opticalImageUrl

  // Body explanation
  const bodyEl = document.createElement('p')
  bodyEl.style.cssText = `
    font-size: 10px;
    line-height: 2.2;
    color: #dddddd;
    margin-bottom: 16px;
  `
  bodyEl.textContent = data.body

  // Science fact box
  const factBox = document.createElement('div')
  factBox.style.cssText = `
    background: #0a1a0a;
    border-left: 4px solid #00ff88;
    padding: 10px 14px;
    font-size: 10px;
    line-height: 2;
    color: #aaffaa;
    margin-bottom: 16px;
  `
  factBox.innerHTML = `<strong style="color:#00ff88;">FACT:</strong> ${data.scienceFact}`

  // Source link
  const sourceEl = document.createElement('p')
  sourceEl.style.cssText = `font-size: 6px; color: #888888; margin-bottom: 20px; line-height:2;`
  sourceEl.innerHTML = `Source: <a href="${data.sourceUrl}" target="_blank" rel="noopener" style="color:#88aaff;">${data.sourceLabel}</a>`

  // Badge earned notice — real badge image
  const badgeEl = document.createElement('div')
  badgeEl.style.cssText = `
    background: #1a1000;
    border: 2px solid #ffaa00;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  `
  const badgeImg = document.createElement('img')
  badgeImg.src = `assets/images/${data.badgeImage}`
  badgeImg.alt = data.badge
  badgeImg.style.cssText = `
    width: 64px;
    height: 64px;
    object-fit: contain;
    image-rendering: pixelated;
    cursor: zoom-in;
    transition: transform 0.15s ease;
  `

  // Hover preview — large badge floats above
  const preview = document.createElement('div')
  preview.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 999;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: #0d0d1a;
    border: 3px solid #ffaa00;
    padding: 16px;
    box-shadow: 0 0 32px #ffaa0066;
  `
  const previewImg = document.createElement('img')
  previewImg.src = `assets/images/${data.badgeImage}`
  previewImg.style.cssText = `
    width: 220px;
    height: 220px;
    object-fit: contain;
    image-rendering: pixelated;
  `
  const previewLabel = document.createElement('div')
  previewLabel.style.cssText = `
    font-family: "Press Start 2P", monospace;
    font-size: 8px;
    color: #ffaa00;
    text-align: center;
    line-height: 2;
  `
  previewLabel.textContent = data.badge
  preview.appendChild(previewImg)
  preview.appendChild(previewLabel)
  document.body.appendChild(preview)

  badgeImg.addEventListener('mouseenter', (e) => {
    badgeImg.style.transform = 'scale(1.15)'
    preview.style.display = 'flex'
    positionPreview(e)
  })
  badgeImg.addEventListener('mousemove', positionPreview)
  badgeImg.addEventListener('mouseleave', () => {
    badgeImg.style.transform = 'scale(1)'
    preview.style.display = 'none'
  })

  function positionPreview(e: MouseEvent) {
    const pw = 252 // approx preview width
    const ph = 300 // approx preview height
    const pad = 12
    let x = e.clientX + pad
    let y = e.clientY - ph - pad
    // Keep on screen
    if (x + pw > window.innerWidth)  x = e.clientX - pw - pad
    if (y < 0)                        y = e.clientY + pad
    preview.style.left = `${x}px`
    preview.style.top  = `${y}px`
  }

  // Clean up preview element when popup closes
  const origRemove = backdrop.remove.bind(backdrop)
  backdrop.remove = () => { preview.remove(); origRemove() }

  const badgeLabel = document.createElement('div')
  badgeLabel.style.cssText = `font-size: 8px; color: #ffaa00; line-height: 2;`
  badgeLabel.innerHTML = `BADGE EARNED:<br><span style="color:#ffffff">${data.badge}</span>`
  badgeEl.appendChild(badgeImg)
  badgeEl.appendChild(badgeLabel)

  // Close button
  const closeBtn = document.createElement('button')
  closeBtn.style.cssText = `
    display: block;
    width: 100%;
    background: #ffff00;
    color: #000000;
    border: none;
    padding: 12px;
    font-family: "Press Start 2P", monospace;
    font-size: 10px;
    cursor: pointer;
    letter-spacing: 1px;
  `
  closeBtn.textContent = '[ CONTINUE MISSION ]'
  closeBtn.addEventListener('click', () => {
    backdrop.remove()
    onClose()
  })

  card.appendChild(sarLabel)
  card.appendChild(title)

  // ── Image comparison ────────────────────────────────────────────────────
  const imgSection = document.createElement('div')
  imgSection.style.cssText = `margin-bottom: 16px;`

  if (hasSar && hasOptical) {
    // Slider header
    const sliderLabel = document.createElement('p')
    sliderLabel.style.cssText = `font-size:8px; color:#ffff00; margin-bottom:8px; letter-spacing:1px;`
    sliderLabel.textContent = '[ RADAR ↔ OPTICAL — DRAG TO COMPARE ]'
    imgSection.appendChild(sliderLabel)

    // Outer container
    const sliderWrap = document.createElement('div')
    sliderWrap.style.cssText = `
      position: relative;
      width: 100%;
      overflow: hidden;
      cursor: ew-resize;
      border: 2px solid #444;
      user-select: none;
      touch-action: none;
    `

    // Base layer — SAR (radar), full width
    const sarImg = document.createElement('img')
    sarImg.src = data.sarImageUrl!
    sarImg.alt = 'SAR radar image'
    sarImg.draggable = false
    sarImg.style.cssText = `display: block; width: 100%; image-rendering: pixelated; pointer-events: none; -webkit-user-drag: none;`

    // Top layer — optical, clipped to left portion
    const optClip = document.createElement('div')
    optClip.style.cssText = `
      position: absolute;
      inset: 0;
      width: 50%;
      overflow: hidden;
    `
    const optImg = document.createElement('img')
    optImg.src = data.opticalImageUrl!
    optImg.alt = 'Optical photo'
    optImg.draggable = false
    optImg.style.cssText = `display: block; width: 100%; min-width: var(--slider-full-width); pointer-events: none; -webkit-user-drag: none;`
    optClip.appendChild(optImg)

    // Divider line + handle
    const divider = document.createElement('div')
    divider.style.cssText = `
      position: absolute;
      top: 0; bottom: 0;
      left: 50%;
      width: 3px;
      background: #ffffff;
      transform: translateX(-50%);
      pointer-events: none;
    `
    const handle = document.createElement('div')
    handle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 32px; height: 32px;
      background: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #000;
      pointer-events: none;
      box-shadow: 0 0 8px rgba(0,0,0,0.6);
    `
    handle.textContent = '⇔'
    divider.appendChild(handle)

    // Left/right labels
    const labelLeft = document.createElement('div')
    labelLeft.style.cssText = `
      position: absolute; top: 6px; left: 8px;
      font-family: "Press Start 2P", monospace;
      font-size: 10px; color: #aaffaa;
      background: rgba(0,0,0,0.6); padding: 2px 6px;
      pointer-events: none;
    `
    labelLeft.textContent = 'OPTICAL from the ground'
    const labelRight = document.createElement('div')
    labelRight.style.cssText = `
      position: absolute; top: 6px; right: 8px;
      font-family: "Press Start 2P", monospace;
      font-size: 10px; color: #44aaff;
      background: rgba(0,0,0,0.6); padding: 2px 6px;
      pointer-events: none;
    `
    labelRight.textContent = 'RADAR from space'

    sliderWrap.appendChild(sarImg)
    sliderWrap.appendChild(optClip)
    sliderWrap.appendChild(divider)
    sliderWrap.appendChild(labelLeft)
    sliderWrap.appendChild(labelRight)

    // Set full width var once SAR image loads so optical img stretches correctly
    sarImg.addEventListener('load', () => {
      optImg.style.setProperty('--slider-full-width', `${sliderWrap.offsetWidth}px`)
      optImg.style.minWidth = `${sliderWrap.offsetWidth}px`
    })

    // Drag logic
    // Labels hidden until the user slides far enough to each side
    labelLeft.style.opacity  = '0'
    labelRight.style.opacity = '0'
    labelLeft.style.transition  = 'opacity 0.15s ease'
    labelRight.style.transition = 'opacity 0.15s ease'

    const updateSlider = (clientX: number) => {
      const rect  = sliderWrap.getBoundingClientRect()
      const pct   = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
      const pctPx = `${(pct * 100).toFixed(1)}%`
      optClip.style.width  = pctPx
      divider.style.left   = pctPx
      // Fade in each label only when that side is sufficiently exposed
      labelLeft.style.opacity  = `${Math.min(1, Math.max(0, (pct - 0.15) / 0.15))}`
      labelRight.style.opacity = `${Math.min(1, Math.max(0, (0.85 - pct) / 0.15))}`
    }

    let dragging = false
    sliderWrap.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      dragging = true
      sliderWrap.setPointerCapture(e.pointerId)
      updateSlider(e.clientX)
    })
    sliderWrap.addEventListener('pointermove', (e) => { if (dragging) updateSlider(e.clientX) })
    sliderWrap.addEventListener('pointerup',   () => { dragging = false })

    // Credits
    const credits = document.createElement('p')
    credits.style.cssText = `font-size:6px; color:#888888; margin-top:4px; line-height:1.8;`
    credits.textContent = [data.sarImageCredit, data.opticalImageCredit].filter(Boolean).join('  |  ')

    imgSection.appendChild(sliderWrap)
    imgSection.appendChild(credits)

  } else if (hasOptical) {
    const credit = data.opticalImageCredit
      ? `<p style="font-size:6px; color:#888888; margin-top:4px; line-height:1.8;">${data.opticalImageCredit}</p>` : ''
    imgSection.innerHTML = `
      <p style="font-size:8px; color:#ffff00; margin-bottom:6px; letter-spacing:1px;">[ OPTICAL PHOTO ]</p>
      <img src="${data.opticalImageUrl}" alt="Ground-level optical photo" style="width:100%; border:2px solid #444; display:block;" />
      ${credit}
    `
  } else {
    imgSection.innerHTML = `
      <div style="background:#1a1a1a; border:2px dashed #444; padding:16px; text-align:center;">
        <p style="font-size:7px; color:#666; line-height:2;">[ IMAGES COMING SOON ]</p>
      </div>
    `
  }

  card.appendChild(imgSection)
  card.appendChild(sarChip)
  card.appendChild(bodyEl)
  card.appendChild(factBox)
  card.appendChild(sourceEl)
  card.appendChild(badgeEl)
  card.appendChild(closeBtn)
  backdrop.appendChild(card)
  document.body.appendChild(backdrop)
}
