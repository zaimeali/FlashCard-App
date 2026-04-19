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

    // Listen for auth state changes and store unsubscribe function
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      this.updateAuthState(session);
    });
  }

  private async initializeAuthState() {
    try {
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
    this.loadingSignal.set(true);

    try {
      const { data, error } = await this.supabaseService.client.auth.signInWithOAuth({
        provider: AuthService.GITHUB_PROVIDER,
        options: {
          redirectTo: `${window.location.origin}`
        }
      });

      if (error) throw error;

      this.getSupabaseSession();

      this.router.navigate(['/']);

      return { success: true };

    } catch (error) {
      alert("Error Logging In");
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
}
