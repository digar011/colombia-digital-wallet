import {
  loginSchema,
  registerSchema,
  passwordResetSchema,
  verifyEmailSchema,
} from '@/lib/validations/auth';

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------

describe('loginSchema', () => {
  it('passes with valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('fails when email is missing', () => {
    const result = loginSchema.safeParse({
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails when email is an empty string', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails when email is invalid', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails when password is too short (under 6 chars)', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('fails when password is missing', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('passes with exactly 6-character password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------

describe('registerSchema', () => {
  const validInput = {
    email: 'citizen@test.com',
    password: 'StrongPass1',
    confirmPassword: 'StrongPass1',
    document_type: 'CC' as const,
    document_number: '1234567890',
    first_name: 'Juan',
    last_name: 'Garcia',
    date_of_birth: '1990-01-15',
  };

  it('passes with valid complete input', () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('passes with optional phone in correct format', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      phone: '+573001234567',
    });
    expect(result.success).toBe(true);
  });

  it('passes when phone is omitted', () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('fails when password and confirmPassword do not match', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('confirmPassword');
    }
  });

  it('fails when password lacks an uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: 'nouppercase1',
      confirmPassword: 'nouppercase1',
    });
    expect(result.success).toBe(false);
  });

  it('fails when password lacks a number', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: 'NoNumberHere',
      confirmPassword: 'NoNumberHere',
    });
    expect(result.success).toBe(false);
  });

  it('fails when password is shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: 'Sh1rt',
      confirmPassword: 'Sh1rt',
    });
    expect(result.success).toBe(false);
  });

  it('fails with invalid document number (letters)', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      document_number: 'ABC123',
    });
    expect(result.success).toBe(false);
  });

  it('fails with document number shorter than 6 digits', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      document_number: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('fails with document number longer than 15 digits', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      document_number: '1234567890123456',
    });
    expect(result.success).toBe(false);
  });

  it('fails with invalid phone format (missing +57 prefix)', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      phone: '3001234567',
    });
    expect(result.success).toBe(false);
  });

  it('fails with phone that has wrong number of digits after +57', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      phone: '+5730012345',
    });
    expect(result.success).toBe(false);
  });

  it('fails when email is missing', () => {
    const { email: _email, ...withoutEmail } = validInput;
    const result = registerSchema.safeParse(withoutEmail);
    expect(result.success).toBe(false);
  });

  it('fails when first_name is missing', () => {
    const { first_name: _fn, ...withoutFirstName } = validInput;
    const result = registerSchema.safeParse(withoutFirstName);
    expect(result.success).toBe(false);
  });

  it('fails when last_name is missing', () => {
    const { last_name: _ln, ...withoutLastName } = validInput;
    const result = registerSchema.safeParse(withoutLastName);
    expect(result.success).toBe(false);
  });

  it('fails when date_of_birth is missing', () => {
    const { date_of_birth: _dob, ...withoutDob } = validInput;
    const result = registerSchema.safeParse(withoutDob);
    expect(result.success).toBe(false);
  });

  it('fails when date_of_birth is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = registerSchema.safeParse({
      ...validInput,
      date_of_birth: futureDate.toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it('fails when date_of_birth is not a valid date', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      date_of_birth: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('fails with invalid document_type', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      document_type: 'INVALID',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid document types', () => {
    const types = ['CC', 'CE', 'TI', 'PP', 'PEP'] as const;
    for (const docType of types) {
      const result = registerSchema.safeParse({
        ...validInput,
        document_type: docType,
      });
      expect(result.success).toBe(true);
    }
  });

  it('fails when first_name is too short', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      first_name: 'J',
    });
    expect(result.success).toBe(false);
  });

  it('fails when last_name is too short', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      last_name: 'G',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// passwordResetSchema
// ---------------------------------------------------------------------------

describe('passwordResetSchema', () => {
  it('passes with a valid email', () => {
    const result = passwordResetSchema.safeParse({
      email: 'reset@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('fails with an invalid email', () => {
    const result = passwordResetSchema.safeParse({
      email: 'invalid-email',
    });
    expect(result.success).toBe(false);
  });

  it('fails with an empty email', () => {
    const result = passwordResetSchema.safeParse({
      email: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails when email is missing', () => {
    const result = passwordResetSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// verifyEmailSchema
// ---------------------------------------------------------------------------

describe('verifyEmailSchema', () => {
  it('passes with a valid token', () => {
    const result = verifyEmailSchema.safeParse({
      token: 'abc123def456',
    });
    expect(result.success).toBe(true);
  });

  it('fails with an empty token', () => {
    const result = verifyEmailSchema.safeParse({
      token: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails when token is missing', () => {
    const result = verifyEmailSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('passes with a long token string', () => {
    const result = verifyEmailSchema.safeParse({
      token: 'a'.repeat(256),
    });
    expect(result.success).toBe(true);
  });
});
