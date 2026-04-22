import { FlashCardGroup } from '../../models/FlashCardGroup.model';
import { FlashCard } from '../../models/FlashCard.model';
import { Hint } from '../../models/Hint.model';

export function mapToFlashCardGroup(raw: any): FlashCardGroup {
  return {
    flashCardGroupId: raw.flashcardgroupid || '',
    name: raw.name || '',
    description: raw.description || '',
    userId: raw.userid || '',
    createdAt: raw.createdat ? new Date(raw.createdat) : new Date(),
    updatedAt: raw.updatedat ? new Date(raw.updatedat) : new Date(),
    flashcards: Array.isArray(raw.flashcards)
      ? raw.flashcards.map((card: any) => mapToFlashCard(card))
      : []
  };
}

export function mapToFlashCard(raw: any): FlashCard {
  return {
    flashCardId: raw.flashcardid || '',
    question: raw.question || '',
    answer: raw.answer || '',
    userId: raw.userid || '',
    createdAt: raw.createdat ? new Date(raw.createdat) : new Date(),
    updatedAt: raw.updatedat ? new Date(raw.updatedat) : new Date(),
    hints: Array.isArray(raw.hints)
      ? raw.hints.map((hint: any) => mapToHint(hint))
      : []
  };
}

export function mapToHint(raw: any): Hint {
  return {
    hintId: raw.hintid || '',
    hint: raw.hint || '',
    userId: raw.userid || '',
    createdAt: raw.createdat ? new Date(raw.createdat) : new Date(),
    updatedAt: raw.updatedat ? new Date(raw.updatedat) : new Date()
  };
}
