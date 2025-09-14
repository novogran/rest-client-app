import {
  authFormSchema,
  signUpSchema,
  type FormState,
} from '@/lib/types/definitions';

describe('Zod Schemas', () => {
  describe('authFormSchema', () => {
    it('should validate correct email and password', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = authFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
      };

      const result = authFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Please enter a valid email.'
      );
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'Password123!',
      };

      const result = authFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Short1!',
      };

      const result = authFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Be at least 8 characters long'
      );
    });

    it('should reject password without letters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345678!',
      };

      const result = authFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Contain at least one letter.'
      );
    });

    it('should reject password without numbers', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password!',
      };

      const result = authFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Contain at least one number.'
      );
    });

    it('should reject password without special characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = authFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Contain at least one special character.'
      );
    });
  });

  describe('signUpSchema', () => {
    it('should validate correct sign up data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Different123!',
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe("Passwords don't match");
      expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
    });

    it('should reject empty confirm password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: '',
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should inherit all validations from authFormSchema', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'short',
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues.length).toBeGreaterThan(1);
    });
  });

  describe('FormState type', () => {
    it('should allow FormState with all error types', () => {
      const formState: FormState = {
        errors: {
          email: ['Invalid email'],
          password: ['Too short', 'Missing number'],
          confirmPassword: ["Passwords don't match"],
          general: ['General error'],
        },
      };

      expect(formState.errors?.email).toEqual(['Invalid email']);
      expect(formState.errors?.password).toEqual([
        'Too short',
        'Missing number',
      ]);
      expect(formState.errors?.confirmPassword).toEqual([
        "Passwords don't match",
      ]);
      expect(formState.errors?.general).toEqual(['General error']);
    });

    it('should allow FormState with success status', () => {
      const formState: FormState = {
        success: true,
        message: 'Registration successful!',
      };

      expect(formState.success).toBe(true);
      expect(formState.message).toBe('Registration successful!');
    });

    it('should allow FormState with partial errors', () => {
      const formState: FormState = {
        errors: {
          email: ['Invalid email'],
        },
      };

      expect(formState.errors?.email).toEqual(['Invalid email']);
      expect(formState.errors?.password).toBeUndefined();
    });

    it('should allow FormState with empty object', () => {
      const formState: FormState = {};
      expect(formState.errors).toBeUndefined();
      expect(formState.success).toBeUndefined();
      expect(formState.message).toBeUndefined();
    });

    it('should allow FormState with only message', () => {
      const formState: FormState = {
        message: 'Test message',
      };

      expect(formState.message).toBe('Test message');
      expect(formState.errors).toBeUndefined();
    });
  });
});
