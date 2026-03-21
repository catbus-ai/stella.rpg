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
    letter-spacing: 1px;
  `
  sarLabel.textContent = '[ SAR IMAGE ]'

  // Title
  const title = document.createElement('h2')
  title.style.cssText = `
    font-size: 14px;
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
    font-size: 7px;
    color: #aaaaff;
    margin-bottom: 16px;
    line-height: 1.8;
  `
  sarChip.textContent = `RADAR: ${data.sarDescription}`

  // Optional optical image
  let opticalSection = ''
  if (data.opticalImageUrl) {
    const credit = data.opticalImageCredit
      ? `<p style="font-size:6px; color:#888888; margin-top:4px; line-height:1.8;">${data.opticalImageCredit}</p>`
      : ''
    opticalSection = `
      <div style="margin-bottom:16px;">
        <p style="font-size:8px; color:#ffff00; margin-bottom:6px; letter-spacing:1px;">[ OPTICAL PHOTO ]</p>
        <img src="${data.opticalImageUrl}" alt="Ground-level optical photo" style="width:100%; border:2px solid #444; display:block;" />
        ${credit}
      </div>
    `
  } else {
    opticalSection = `
      <div style="margin-bottom:16px; background:#1a1a1a; border:2px dashed #444; padding:16px; text-align:center;">
        <p style="font-size:7px; color:#666; line-height:2;">[ OPTICAL PHOTO COMING SOON ]</p>
      </div>
    `
  }

  // Body explanation
  const bodyEl = document.createElement('p')
  bodyEl.style.cssText = `
    font-size: 8px;
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
    font-size: 7px;
    line-height: 2;
    color: #aaffaa;
    margin-bottom: 16px;
  `
  factBox.innerHTML = `<strong style="color:#00ff88;">FACT:</strong> ${data.scienceFact}`

  // Source link
  const sourceEl = document.createElement('p')
  sourceEl.style.cssText = `font-size: 7px; color: #888888; margin-bottom: 20px; line-height:2;`
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
    font-size: 9px;
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
  badgeLabel.style.cssText = `font-size: 9px; color: #ffaa00; line-height: 2;`
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
  card.appendChild(sarChip)
  card.insertAdjacentHTML('beforeend', opticalSection)
  card.appendChild(bodyEl)
  card.appendChild(factBox)
  card.appendChild(sourceEl)
  card.appendChild(badgeEl)
  card.appendChild(closeBtn)
  backdrop.appendChild(card)
  document.body.appendChild(backdrop)
}
