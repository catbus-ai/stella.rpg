// ── Portrait Registry ────────────────────────────────────────────────────────
// To add a new portrait:
//   1. Drop the PNG in public/assets/images/
//   2. Add an entry here
//   3. Use the key string in any dialogue step: portrait: 'shay-happy'
//
// The key becomes the Phaser texture key AND the lookup for the DOM dialogue.

export interface PortraitDef {
  file:        string  // filename inside public/assets/images/
  speaker:     string  // default speaker name shown in dialogue box
  borderColor: string  // CSS color — dialogue box border + glow
  nameColor:   string  // CSS color — speaker name label
}

export const PORTRAITS: Record<string, PortraitDef> = {
  // ── Dr. Shay ──────────────────────────────────────────────────────────────
  'shay': {
    file:        'portrait_shay.png',
    speaker:     'DR. SHAY',
    borderColor: '#44aaff',
    nameColor:   '#66ccff',
  },
  'shay-talk': {
    file:        'portrait_shay_talk.png',
    speaker:     'DR. SHAY',
    borderColor: '#44aaff',
    nameColor:   '#66ccff',
  },
  'shay-serious': {
    file:        'portrait_shay_serious.png',
    speaker:     'DR. SHAY',
    borderColor: '#44aaff',
    nameColor:   '#66ccff',
  },

  // ── Stella ────────────────────────────────────────────────────────────────
  'stella': {
    file:        'portrait_stella.png',
    speaker:     'STELLA',
    borderColor: '#ffaa00',
    nameColor:   '#ffaa00',
  },
  'stella-mouthopen': {
    file:        'portrait_stella_mouthopen.png',
    speaker:     'STELLA',
    borderColor: '#ffaa00',
    nameColor:   '#ffaa00',
  },
  'stella-eyes': {
    file:        'portrait_stella_eyesclosed.png',
    speaker:     'STELLA',
    borderColor: '#ffdd00',
    nameColor:   '#ffdd00',
  },
}
