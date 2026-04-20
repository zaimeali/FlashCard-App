import { FlashCard } from "./FlashCard.model";

export interface FlashCardGroup {
    flashCardGroupId: string;
    name: string;
    description: string;
    flashcards: Array<FlashCard>;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}