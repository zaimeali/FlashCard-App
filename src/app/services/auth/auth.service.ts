import { computed, effect, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Router } from '@angular/router';
import { Routes } from '../../utils/auth-guard/constants/routes';
import { Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private static readonly GITHUB_PROVIDER = 'github';
  private static readonly GOOGLE_PROVIDER = 'google';

  // State Management - Signals
  private userSignal = signal<User | null>(null);
  private sessionSignal = signal<Session | null>(null);
  private loadingSignal = signal<boolean>(true);

  // Readonly Signals
  user = this.userSignal.asReadonly();
  session = this.sessionSignal.asReadonly();
  isLoading = this.loadingSignal.asReadonly();

  // Computed property
  isAuthenticated = computed(() => !!this.userSignal());

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.initializeAuthState();

    effect((onCleanUp) => {
      const user = this.userSignal();

      onCleanUp(() => { });
    });
  }

  private async getSupabaseSession() {
    const { data: { session } } = await this.supabaseService.client.auth.getSession();
    this.updateAuthState(session);
  }

  private setupAuthStateListener() {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      console.log('[AuthService] Auth state changed:', event, !!session);
      this.updateAuthState(session);
    });
  }

  private async initializeAuthState() {
    try {
      this.setupAuthStateListener();
      await this.getSupabaseSession();
    } catch (error) {
      console.error("Error initializing auth state: ", error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private updateAuthState(session: Session | null) {
    this.sessionSignal.set(session);
    this.userSignal.set(session?.user ?? null);
  }

  public async loginWithGithub() {
    return this.loginWithOAuth(AuthService.GITHUB_PROVIDER);
  }

  public async loginWithGoogle() {
    return this.loginWithOAuth(AuthService.GOOGLE_PROVIDER);
  }

  private async loginWithOAuth(provider: string) {
    this.loadingSignal.set(true);

    try {
      const { data, error } = await this.supabaseService.client.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}`
        }
      });

      if (error) throw error;

      // Note: We don't call getSupabaseSession() or navigate directly here.
      // signInWithOAuth triggers a browser redirect. The auth state will be
      // initialized when the user is redirected back to the app.

      return { success: true };

    } catch (error) {
      alert(`Error Logging In with ${provider}`);
      console.error("Login Error: ", error);
      return { success: false, error: error };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  public async logout() {
    console.log('[AuthService] Logout started');
    try {
      const { error } = await this.supabaseService.client.auth.signOut();

      if (error) {
        alert("Error Logging Out");
        console.error("Logout Error: ", error);
      }

      // Manually clear auth signals BEFORE navigating
      console.log('[AuthService] Clearing auth signals');
      this.updateAuthState(null);

      console.log('[AuthService] Navigating to login');
      await this.router.navigate([`/${Routes.LOGIN}`]);
    } catch (error) {
      alert("Error Logging Out");
      console.error("Logout Error: ", error);
    }
  }

  public async deleteAccount() {
    console.log('[AuthService] Delete Account started');
    try {
      // Use the local signal first to avoid unnecessary network calls if the session is already known
      let user = this.userSignal();

      if (!user) {
        const { data: { user: freshUser }, error: userError } = await this.supabaseService.client.auth.getUser();
        if (userError || !freshUser) throw new Error('No authenticated user found');
        user = freshUser;
      }

      const { error: deleteFlashcardDataError } = await this.supabaseService.client.rpc('delete_all_user_flashcard_data', {
        p_user_id: user.id
      });

      if (deleteFlashcardDataError) throw deleteFlashcardDataError;

      const { error: deleteError } = await this.supabaseService.client.rpc('delete_self');

      if (deleteError) throw deleteError;

      // After deleting the user record, we MUST sign out to properly clear the local session/storage
      const { error: signOutError } = await this.supabaseService.client.auth.signOut();
      if (signOutError) throw signOutError;

      this.updateAuthState(null);

      this.router.navigate([`/${Routes.LOGIN}`]);

      return { success: true };
    } catch (error) {
      alert("Error Deleting Account");
      console.error("Delete Account Error: ", error);
      return { success: false, error: error };
    }
  }
}
