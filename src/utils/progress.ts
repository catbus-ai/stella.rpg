// Persists chapter completion + earned badges to localStorage.

export interface BadgeRecord {
  label: string
  image: string
}

export interface ChapterProgress {
  started: boolean
  complete: boolean
  badges: BadgeRecord[]
}

const key = (chapterId: number) => `stella_chapter_${chapterId}`

export function markChapterStarted(chapterId: number) {
  const existing = loadChapterProgress(chapterId)
  if (existing?.complete) return  // don't overwrite a finished run
  const record: ChapterProgress = { started: true, complete: false, badges: [] }
  localStorage.setItem(key(chapterId), JSON.stringify(record))
}

export function saveChapterProgress(chapterId: number, badges: BadgeRecord[]) {
  const record: ChapterProgress = { started: true, complete: true, badges }
  localStorage.setItem(key(chapterId), JSON.stringify(record))
}

export function loadChapterProgress(chapterId: number): ChapterProgress | null {
  const raw = localStorage.getItem(key(chapterId))
  if (!raw) return null
  try { return JSON.parse(raw) as ChapterProgress } catch { return null }
}
