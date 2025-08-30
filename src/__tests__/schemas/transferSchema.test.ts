import { transferSchema } from '../../screens/Transfer/transferSchema';

describe('Transfer Schema', () => {
  const mockFromClient = {
    id: '2',
    name: 'Ana Costa X',
    balance: 3000,
    document: '98765432100',
  };

  const mockToClient = {
    id: '3',
    name: 'Carlos Ferreira',
    balance: 1140.25,
    document: '11122233300',
  };

  describe('fromClient validation', () => {
    it('should pass with valid fromClient', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '500',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with missing fromClient', () => {
      const invalidData = {
        toClient: mockToClient,
        amount: '500',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Cliente de origem é obrigatório');
      }
    });

    it('should fail with invalid fromClient structure', () => {
      const invalidData = {
        fromClient: { id: '2' },
        toClient: mockToClient,
        amount: '500',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('toClient validation', () => {
    it('should pass with valid toClient', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '500',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with missing toClient', () => {
      const invalidData = {
        fromClient: mockFromClient,
        amount: '500',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Cliente de destino é obrigatório');
      }
    });

    it('should fail with invalid toClient structure', () => {
      const invalidData = {
        fromClient: mockFromClient,
        toClient: { name: 'Carlos' },
        amount: '500',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('amount validation', () => {
    it('should pass with valid positive amount', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '500',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should pass with decimal amount using dot', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '500.50',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should pass with decimal amount using comma', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '500,50',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with empty amount', () => {
      const invalidData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor é obrigatório');
      }
    });

    it('should fail with zero amount', () => {
      const invalidData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '0',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor deve ser maior que zero');
      }
    });

    it('should fail with negative amount', () => {
      const invalidData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '-100',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor deve ser maior que zero');
      }
    });

    it('should fail with non-numeric amount', () => {
      const invalidData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: 'abc',
      };

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor deve ser maior que zero');
      }
    });

    it('should pass with large amounts', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '999999.99',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('complete validation scenarios', () => {
    it('should fail with all missing fields', () => {
      const invalidData = {};

      const result = transferSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3);
      }
    });

    it('should pass with realistic transfer scenario', () => {
      const validTransfer = {
        fromClient: {
          id: '2',
          name: 'Ana Costa X',
          balance: 3000,
          document: '98765432100',
        },
        toClient: {
          id: '3',
          name: 'Carlos Ferreira',
          balance: 1140.25,
          document: '11122233300',
        },
        amount: '250,00',
      };

      const result = transferSchema.safeParse(validTransfer);
      expect(result.success).toBe(true);
    });

    it('should handle edge case with minimal valid amount', () => {
      const validData = {
        fromClient: mockFromClient,
        toClient: mockToClient,
        amount: '0.01',
      };

      const result = transferSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});