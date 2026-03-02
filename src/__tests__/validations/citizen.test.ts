import {
  updateProfileSchema,
  appointmentBookingSchema,
} from '@/lib/validations/citizen';

// ---------------------------------------------------------------------------
// updateProfileSchema
// ---------------------------------------------------------------------------

describe('updateProfileSchema', () => {
  it('passes with all optional fields empty (empty object)', () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('passes with valid phone in Colombian format', () => {
    const result = updateProfileSchema.safeParse({
      phone: '+573001234567',
    });
    expect(result.success).toBe(true);
  });

  it('passes with phone containing spaces (stripped internally)', () => {
    const result = updateProfileSchema.safeParse({
      phone: '+57 300 123 4567',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid phone format (missing +57)', () => {
    const result = updateProfileSchema.safeParse({
      phone: '3001234567',
    });
    expect(result.success).toBe(false);
  });

  it('fails with phone that has wrong digit count', () => {
    const result = updateProfileSchema.safeParse({
      phone: '+57300123',
    });
    expect(result.success).toBe(false);
  });

  it('passes with valid email', () => {
    const result = updateProfileSchema.safeParse({
      email: 'citizen@gov.co',
    });
    expect(result.success).toBe(true);
  });

  it('passes with empty string email', () => {
    const result = updateProfileSchema.safeParse({
      email: '',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = updateProfileSchema.safeParse({
      email: 'not-valid',
    });
    expect(result.success).toBe(false);
  });

  it('passes with valid address', () => {
    const result = updateProfileSchema.safeParse({
      address: 'Calle 100 #10-20, Bogota',
    });
    expect(result.success).toBe(true);
  });

  it('fails with address longer than 200 characters', () => {
    const result = updateProfileSchema.safeParse({
      address: 'A'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('passes with address exactly 200 characters', () => {
    const result = updateProfileSchema.safeParse({
      address: 'A'.repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it('passes with empty string address', () => {
    const result = updateProfileSchema.safeParse({
      address: '',
    });
    expect(result.success).toBe(true);
  });

  it('passes with valid city', () => {
    const result = updateProfileSchema.safeParse({
      city: 'Bogota',
    });
    expect(result.success).toBe(true);
  });

  it('fails with city longer than 100 characters', () => {
    const result = updateProfileSchema.safeParse({
      city: 'B'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('passes with valid department', () => {
    const result = updateProfileSchema.safeParse({
      department: 'Cundinamarca',
    });
    expect(result.success).toBe(true);
  });

  it('fails with department longer than 100 characters', () => {
    const result = updateProfileSchema.safeParse({
      department: 'D'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('passes with all fields provided and valid', () => {
    const result = updateProfileSchema.safeParse({
      phone: '+573001234567',
      email: 'citizen@test.com',
      address: 'Carrera 15 #80-20',
      city: 'Medellin',
      department: 'Antioquia',
    });
    expect(result.success).toBe(true);
  });

  it('passes with phone as undefined', () => {
    const result = updateProfileSchema.safeParse({
      phone: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('passes with empty phone (empty string triggers no validation)', () => {
    const result = updateProfileSchema.safeParse({
      phone: '',
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// appointmentBookingSchema
// ---------------------------------------------------------------------------

describe('appointmentBookingSchema', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const validInput = {
    service_type: 'cedula' as const,
    preferred_date: tomorrowStr,
    preferred_time: '10:00',
  };

  it('passes with valid input', () => {
    const result = appointmentBookingSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('passes with valid input and notes', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      notes: 'Necesito renovar mi cedula',
    });
    expect(result.success).toBe(true);
  });

  it('passes with empty string notes', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      notes: '',
    });
    expect(result.success).toBe(true);
  });

  it('fails with a past date', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      preferred_date: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('fails when service_type is missing', () => {
    const { service_type: _st, ...withoutServiceType } = validInput;
    const result = appointmentBookingSchema.safeParse(withoutServiceType);
    expect(result.success).toBe(false);
  });

  it('fails with invalid service_type', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      service_type: 'invalid_service',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid service types', () => {
    const serviceTypes = [
      'cedula',
      'pasaporte',
      'licencia_conduccion',
      'registro_civil',
      'antecedentes',
      'certificado_electoral',
      'afiliacion_salud',
      'pension',
      'subsidio',
      'otro',
    ] as const;

    for (const st of serviceTypes) {
      const result = appointmentBookingSchema.safeParse({
        ...validInput,
        service_type: st,
      });
      expect(result.success).toBe(true);
    }
  });

  it('fails with notes longer than 500 characters', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      notes: 'N'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('passes with notes exactly 500 characters', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      notes: 'N'.repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it('fails when preferred_date is missing', () => {
    const { preferred_date: _pd, ...withoutDate } = validInput;
    const result = appointmentBookingSchema.safeParse(withoutDate);
    expect(result.success).toBe(false);
  });

  it('fails when preferred_date is empty', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      preferred_date: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails when preferred_date is not a valid date', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      preferred_date: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('fails when preferred_time is missing', () => {
    const { preferred_time: _pt, ...withoutTime } = validInput;
    const result = appointmentBookingSchema.safeParse(withoutTime);
    expect(result.success).toBe(false);
  });

  it('fails when preferred_time is empty', () => {
    const result = appointmentBookingSchema.safeParse({
      ...validInput,
      preferred_time: '',
    });
    expect(result.success).toBe(false);
  });
});
