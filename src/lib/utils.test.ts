import { cn } from './utils'

describe('cn (className utility)', () => {
  test('combines multiple class strings', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })
  test('handles undefined and null values', () => {
    expect(cn('class1', undefined, 'class2', null)).toBe('class1 class2')
  })
  test('handles conditional classes with objects', () => {
    expect(cn('base', { 'active': true, 'disabled': false })).toBe('base active')
  })
  test('handles arrays of classes', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
  })
  test('merges Tailwind utilities correctly', () => {
    // p-8 completely overrides both p-4 and px-6 since it's a more general padding that comes later
    expect(cn('p-4 px-6', 'p-8')).toBe('p-8')
    // More specific test cases for padding
    expect(cn('p-4', 'px-6')).toBe('p-4 px-6')
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6')
  })
  test('handles complex Tailwind conflicts', () => {
    const result = cn(
      'text-gray-500 p-4',
      'text-blue-500',
      'p-8',
      { 'text-red-500': true }
    )
    expect(result).toBe('p-8 text-red-500')
  })
  test('preserves responsive and state variants', () => {
    const result = cn(
      'sm:p-4 hover:text-blue-500',
      'sm:p-8',
      'hover:text-red-500'
    )
    expect(result).toBe('sm:p-8 hover:text-red-500')
  })
  test('handles arbitrary values', () => {
    const result = cn(
      'grid-cols-[1fr,2fr]',
      'grid-cols-[1fr,1fr]'
    )
    expect(result).toBe('grid-cols-[1fr,1fr]')
  })
  test('handles multiple class formats together', () => {
    const result = cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      { 'conditional-true': true, 'conditional-false': false },
      undefined,
      null
    )
    expect(result).toBe('base-class array-class-1 array-class-2 conditional-true')
  })
  test('merges dark mode classes correctly', () => {
    const result = cn(
      'text-black dark:text-white',
      'dark:text-gray-100'
    )
    expect(result).toBe('text-black dark:text-gray-100')
  })
})