import { cn } from '@/lib/utils/cn';

describe('cn() utility', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('handles null values', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('handles false values', () => {
    expect(cn('foo', false, 'bar')).toBe('foo bar');
  });

  it('handles empty string values', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('resolves Tailwind conflicts by keeping the last conflicting class', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('resolves Tailwind color conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('preserves non-conflicting Tailwind classes', () => {
    expect(cn('p-2', 'mx-4')).toBe('p-2 mx-4');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('returns empty string when all inputs are falsy', () => {
    expect(cn(undefined, null, false, '')).toBe('');
  });

  it('handles conditional classes via clsx-style objects', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', { active: isActive, disabled: isDisabled })).toBe(
      'base active'
    );
  });

  it('handles array inputs', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('resolves complex Tailwind conflicts', () => {
    expect(cn('bg-red-500 text-white', 'bg-blue-500')).toBe(
      'text-white bg-blue-500'
    );
  });
});
