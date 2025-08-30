import { loginSchema } from '../../screens/Login/schema';

describe('Login Schema', () => {
  describe('email validation', () => {
    it('should pass with valid email', () => {
      const validData = {
        email: 'joao@bank.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with empty email', () => {
      const invalidData = {
        email: '',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('E-mail é obrigatório');
      }
    });

    it('should fail with invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de e-mail inválido');
      }
    });

    it('should fail with email without @', () => {
      const invalidData = {
        email: 'joaobank.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de e-mail inválido');
      }
    });

    it('should fail with email without domain', () => {
      const invalidData = {
        email: 'joao@',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de e-mail inválido');
      }
    });
  });

  describe('password validation', () => {
    it('should pass with valid password', () => {
      const validData = {
        email: 'joao@bank.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with empty password', () => {
      const invalidData = {
        email: 'joao@bank.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Senha é obrigatória');
      }
    });

    it('should fail with password less than 6 characters', () => {
      const invalidData = {
        email: 'joao@bank.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Senha deve ter no mínimo 6 caracteres');
      }
    });

    it('should pass with password exactly 6 characters', () => {
      const validData = {
        email: 'joao@bank.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should pass with password longer than 6 characters', () => {
      const validData = {
        email: 'joao@bank.com',
        password: '1234567890',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('combined validation', () => {
    it('should fail with both email and password invalid', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
        expect(result.error.issues.some(issue => issue.message.includes('e-mail'))).toBe(true);
        expect(result.error.issues.some(issue => issue.message.includes('Senha'))).toBe(true);
      }
    });

    it('should pass with valid credentials matching db.json data', () => {
      const validCredentials = [
        {
          email: 'joao@bank.com',
          password: '123456',
        },
        {
          email: 'maria@bank.com',
          password: '123456',
        },
      ];

      validCredentials.forEach(credentials => {
        const result = loginSchema.safeParse(credentials);
        expect(result.success).toBe(true);
      });
    });
  });
});