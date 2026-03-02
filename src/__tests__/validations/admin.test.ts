import {
  issueDocumentSchema,
  searchCitizensSchema,
  updateCitizenStatusSchema,
  ADMIN_DOCUMENT_TYPES,
  CITIZEN_STATUSES,
} from '@/lib/validations/admin';

// ---------------------------------------------------------------------------
// issueDocumentSchema
// ---------------------------------------------------------------------------

describe('issueDocumentSchema', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000';

  it('passes with valid UUID and document type', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'cedula_ciudadania',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid UUID format', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: 'not-a-uuid',
      document_type: 'cedula_ciudadania',
    });
    expect(result.success).toBe(false);
  });

  it('fails with empty citizen_id', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: '',
      document_type: 'cedula_ciudadania',
    });
    expect(result.success).toBe(false);
  });

  it('fails with invalid document type', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid admin document types', () => {
    for (const docType of ADMIN_DOCUMENT_TYPES) {
      const result = issueDocumentSchema.safeParse({
        citizen_id: validUUID,
        document_type: docType,
      });
      expect(result.success).toBe(true);
    }
  });

  it('passes with valid optional expiry_date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'pasaporte',
      expiry_date: futureDate.toISOString().split('T')[0],
    });
    expect(result.success).toBe(true);
  });

  it('fails with past expiry_date', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'pasaporte',
      expiry_date: '2020-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('passes when expiry_date is omitted', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'cedula_ciudadania',
    });
    expect(result.success).toBe(true);
  });

  it('passes when expiry_date is empty string', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'cedula_ciudadania',
      expiry_date: '',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid expiry_date string', () => {
    const result = issueDocumentSchema.safeParse({
      citizen_id: validUUID,
      document_type: 'cedula_ciudadania',
      expiry_date: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// searchCitizensSchema
// ---------------------------------------------------------------------------

describe('searchCitizensSchema', () => {
  it('passes with valid query', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan Garcia',
    });
    expect(result.success).toBe(true);
  });

  it('fails with query shorter than 2 characters', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'J',
    });
    expect(result.success).toBe(false);
  });

  it('passes with exactly 2-character query', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Ju',
    });
    expect(result.success).toBe(true);
  });

  it('fails with empty query', () => {
    const result = searchCitizensSchema.safeParse({
      query: '',
    });
    expect(result.success).toBe(false);
  });

  it('passes with valid pagination (page and limit)', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      page: 1,
      limit: 20,
    });
    expect(result.success).toBe(true);
  });

  it('passes when page and limit are omitted', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
    });
    expect(result.success).toBe(true);
  });

  it('fails with limit over 100', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      limit: 101,
    });
    expect(result.success).toBe(false);
  });

  it('passes with limit exactly 100', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      limit: 100,
    });
    expect(result.success).toBe(true);
  });

  it('fails with limit of 0', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      limit: 0,
    });
    expect(result.success).toBe(false);
  });

  it('fails with negative page', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      page: -1,
    });
    expect(result.success).toBe(false);
  });

  it('fails with page of 0', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      page: 0,
    });
    expect(result.success).toBe(false);
  });

  it('fails with non-integer page', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      page: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('fails with non-integer limit', () => {
    const result = searchCitizensSchema.safeParse({
      query: 'Juan',
      limit: 10.5,
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// updateCitizenStatusSchema
// ---------------------------------------------------------------------------

describe('updateCitizenStatusSchema', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000';

  const validInput = {
    citizen_id: validUUID,
    status: 'suspended' as const,
    reason: 'Citizen requested account suspension pending investigation',
  };

  it('passes with valid input', () => {
    const result = updateCitizenStatusSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('fails with reason shorter than 10 characters', () => {
    const result = updateCitizenStatusSchema.safeParse({
      ...validInput,
      reason: 'Too short',
    });
    expect(result.success).toBe(false);
  });

  it('passes with reason exactly 10 characters', () => {
    const result = updateCitizenStatusSchema.safeParse({
      ...validInput,
      reason: '1234567890',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid status', () => {
    const result = updateCitizenStatusSchema.safeParse({
      ...validInput,
      status: 'deleted',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid citizen statuses', () => {
    for (const status of CITIZEN_STATUSES) {
      const result = updateCitizenStatusSchema.safeParse({
        ...validInput,
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it('fails with invalid UUID for citizen_id', () => {
    const result = updateCitizenStatusSchema.safeParse({
      ...validInput,
      citizen_id: 'not-a-valid-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('fails with empty citizen_id', () => {
    const result = updateCitizenStatusSchema.safeParse({
      ...validInput,
      citizen_id: '',
    });
    expect(result.success).toBe(false);
  });

  it('fails when reason is missing', () => {
    const { reason: _r, ...withoutReason } = validInput;
    const result = updateCitizenStatusSchema.safeParse(withoutReason);
    expect(result.success).toBe(false);
  });

  it('fails when status is missing', () => {
    const { status: _s, ...withoutStatus } = validInput;
    const result = updateCitizenStatusSchema.safeParse(withoutStatus);
    expect(result.success).toBe(false);
  });

  it('fails when citizen_id is missing', () => {
    const { citizen_id: _cid, ...withoutCitizenId } = validInput;
    const result = updateCitizenStatusSchema.safeParse(withoutCitizenId);
    expect(result.success).toBe(false);
  });
});
