import { Injectable } from '@angular/core';
import { FlashCardGroup } from '../../models/FlashCardGroup.model';
import { SupabaseService } from '../supabase/supabase.service';
import { Router } from '@angular/router';
import { Routes } from '../../utils/auth-guard/constants/routes';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  public async createFlashCardGroup(flashCardGroup: FlashCardGroup): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client.rpc('create_flashcards', {
        p_payload: flashCardGroup
      });

      if (error) {
        throw error;
      }

      console.log('Flashcard group created successfully: ', data);
      alert('Flashcard group created successfully');

      this.router.navigate([Routes.HOME]);
    } catch (error) {
      console.error('Error creating flashcard group: ', error);
      throw new Error('Error creating flashcard group');
    }
  }
}
