import { Hint } from "./Hint.model";

export interface FlashCard {
    flashCardId: string;
    question: string;
    answer: string;
    hints: Array<Hint>;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}