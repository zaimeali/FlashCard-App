import { Injectable, inject } from '@angular/core';
import { FlashCardGroup } from '../../models/FlashCardGroup.model';
import { SupabaseService } from '../supabase/supabase.service';
import { Router } from '@angular/router';
import { Routes } from '../../utils/auth-guard/constants/routes';
import { AlertService } from '../alert/alert.service';
import { mapToFlashCardGroup } from '../../utils/mappers/flashcard-mapper';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private alertService = inject(AlertService);

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
      this.alertService.success('Success!', 'Flashcard group created successfully');

      this.router.navigate([Routes.HOME]);
    } catch (error) {
      console.error('Error creating flashcard group: ', error);
      this.alertService.error('Error', 'Failed to create flashcard group. Please try again.');
      throw new Error('Error creating flashcard group');
    }
  }

  public async getFlashCardGroups(): Promise<Array<FlashCardGroup>> {
    try {
      const { data, error } = await this.supabaseService.client.rpc('get_all_flashcardgroups');

      if (error) {
        throw error;
      }

      const rawData = data as any[];
      return rawData.map(group => mapToFlashCardGroup(group));
    } catch (error) {
      console.error('Error getting flashcard groups: ', error);
      throw new Error('Error getting flashcard groups');
    }
  }

  public async deleteFlashCardGroup(flashCardGroupId: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client.rpc('delete_flashcard_group', {
        p_flashcard_group_id: flashCardGroupId
      });

      if (error) {
        throw error;
      }

      console.log('Flashcard group deleted successfully: ', data);
      this.alertService.success('Deleted!', 'Flashcard group deleted successfully');
    } catch (error) {
      console.error('Error deleting flashcard group: ', error);
      this.alertService.error('Error', 'Failed to delete flashcard group. Please verify that the group exists and you have permission to delete it.');
      throw new Error('Error deleting flashcard group');
    }
  }

  public async updateFlashCardGroup(flashCardGroup: FlashCardGroup): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client.rpc('update_flashcard_group', {
        p_flashcard_group_id: flashCardGroup.flashCardGroupId,
        p_flashcard_group_name: flashCardGroup.name,
        p_flashcard_group_description: flashCardGroup.description
      });

      if (error) {
        throw error;
      }

      console.log('Flashcard group updated successfully: ', data);
    } catch (error) {
      console.error('Error updating flashcard group: ', error);
      this.alertService.error('Error', 'Failed to update flashcard group. Please try again.');
      throw new Error('Error updating flashcard group');
    }
  }
}
