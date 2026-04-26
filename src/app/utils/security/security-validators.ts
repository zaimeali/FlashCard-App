import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Security validators to prevent common XSS and injection patterns.
 */
export class SecurityValidators {
  /**
   * Prevents use of characters that could be used for XSS (<, >)
   */
  static noMaliciousContent(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      // Basic XSS check: block < and >
      const hasTags = /[<>]/g.test(control.value);
      
      // Check for common malicious script patterns even without tags
      const hasScriptPatterns = /(javascript:|onload=|onerror=|onclick=)/gi.test(control.value);

      // Check for common SQL injection patterns
      const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|UNION|EXEC|EXECUTE)\b/gi;
      const hasSqlPatterns = sqlKeywords.test(control.value);

      return hasTags || hasScriptPatterns || hasSqlPatterns ? { unsafe: true } : null;
    };
  }
}

/**
 * Sanitizes a string by trimming it.
 * Note: Angular template binding already sanitizes for XSS when displaying.
 * This is for extra safety before sending to the backend.
 */
export function sanitizeInput(value: string): string {
  if (!value) return '';
  return value.trim();
}
