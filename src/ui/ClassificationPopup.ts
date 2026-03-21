import { ChallengePointData, LandCoverClass, CLASS_LABELS } from '../data/classificationMissions'

export interface ClassificationResult {
  correct: boolean
  chosen: LandCoverClass
}

export function showClassificationPopup(
  point: ChallengePointData,
  question: string,
  onClose: (result: ClassificationResult) => void
) {
  // Backdrop
  const backdrop = document.createElement('div')
  backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  // Card
  const card = document.createElement('div')
  card.style.cssText = `
    background: #0d0d1a;
    border: 3px solid #ff8800;
    padding: 28px 32px;
    max-width: 480px;
    width: 92%;
    font-family: "Press Start 2P", monospace;
    color: #ffffff;
    position: relative;
  `

  // Mission label
  const missionLabel = document.createElement('p')
  missionLabel.style.cssText = `
    font-size: 8px;
    color: #ff8800;
    margin-bottom: 8px;
    letter-spacing: 1px;
  `
  missionLabel.textContent = '[ CLASSIFICATION MISSION ]'

  // Question
  const questionEl = document.createElement('h2')
  questionEl.style.cssText = `
    font-size: 12px;
    color: #ffffff;
    margin: 0 0 24px 0;
    line-height: 1.8;
  `
  questionEl.textContent = question

  // Answer buttons
  const btnContainer = document.createElement('div')
  btnContainer.style.cssText = `display: flex; flex-direction: column; gap: 12px;`

  const answers: LandCoverClass[] = ['burnt', 'intact', 'vegetation']

  answers.forEach((answer) => {
    const btn = document.createElement('button')
    btn.style.cssText = `
      background: #1a1a2e;
      border: 2px solid #ff8800;
      color: #ffffff;
      padding: 12px 16px;
      font-family: "Press Start 2P", monospace;
      font-size: 9px;
      cursor: pointer;
      letter-spacing: 1px;
      text-align: left;
      transition: background 0.1s;
    `
    btn.textContent = CLASS_LABELS[answer]

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#2a1a00'
      btn.style.borderColor = '#ffaa00'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#1a1a2e'
      btn.style.borderColor = '#ff8800'
    })

    btn.addEventListener('click', () => {
      const correct = answer === point.correctAnswer
      // Disable all buttons immediately
      card.querySelectorAll('button').forEach((b) => ((b as HTMLButtonElement).disabled = true))

      if (correct) {
        showFeedback(card, true, null, () => {
          backdrop.remove()
          onClose({ correct: true, chosen: answer })
        })
      } else {
        showFeedback(card, false, point.wrongHint, () => {
          backdrop.remove()
          onClose({ correct: false, chosen: answer })
        })
      }
    })

    btnContainer.appendChild(btn)
  })

  card.appendChild(missionLabel)
  card.appendChild(questionEl)
  card.appendChild(btnContainer)
  backdrop.appendChild(card)
  document.body.appendChild(backdrop)
}

// ── Inline feedback shown after choosing ─────────────────────────────────
function showFeedback(
  card: HTMLElement,
  correct: boolean,
  hint: string | null,
  onContinue: () => void
) {
  // Clear existing content, replace with feedback
  card.innerHTML = ''

  const resultLabel = document.createElement('p')
  resultLabel.style.cssText = `
    font-size: 10px;
    color: ${correct ? '#00ff88' : '#ff2244'};
    margin-bottom: 16px;
    letter-spacing: 1px;
  `
  resultLabel.textContent = correct ? '[ CORRECT ]' : '[ WRONG ]'

  const resultMsg = document.createElement('p')
  resultMsg.style.cssText = `
    font-size: 8px;
    line-height: 2.2;
    color: #dddddd;
    margin-bottom: ${hint ? '16px' : '24px'};
  `
  resultMsg.textContent = correct
    ? 'Good identification, Stella. That matches the radar signature. Data logged.'
    : 'Not quite. Check your radar reading.'

  card.appendChild(resultLabel)
  card.appendChild(resultMsg)

  if (!correct && hint) {
    const hintBox = document.createElement('div')
    hintBox.style.cssText = `
      background: #1a0000;
      border-left: 4px solid #ff2244;
      padding: 10px 14px;
      font-size: 7px;
      line-height: 2;
      color: #ffaaaa;
      margin-bottom: 24px;
    `
    hintBox.innerHTML = `<strong style="color:#ff2244;">HINT:</strong> ${hint}`
    card.appendChild(hintBox)

    const hpWarning = document.createElement('p')
    hpWarning.style.cssText = `
      font-size: 7px;
      color: #ff4444;
      margin-bottom: 20px;
      letter-spacing: 1px;
    `
    hpWarning.textContent = '- 15 HP'
    card.appendChild(hpWarning)
  }

  const continueBtn = document.createElement('button')
  continueBtn.style.cssText = `
    display: block;
    width: 100%;
    background: ${correct ? '#00ff88' : '#ff2244'};
    color: #000000;
    border: none;
    padding: 12px;
    font-family: "Press Start 2P", monospace;
    font-size: 10px;
    cursor: pointer;
    letter-spacing: 1px;
  `
  continueBtn.textContent = '[ CONTINUE ]'
  continueBtn.addEventListener('click', onContinue)
  card.appendChild(continueBtn)
}
