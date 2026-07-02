import { describe, expect, it } from 'vitest'
import { URL_REGEXP } from './regexp.js'

describe('URL_REGEXP', () => {
  it('should accept valid https URLs', () => {
    const validUrls = [
      'https://example.com',
      'https://www.example.com',
      'https://sub.example.com',
      'https://example.com/',
      'https://example.com/path',
      'https://example.com/path/to/page',
      'https://my-site.com',
      'https://my_site.com',
    ]

    validUrls.forEach((url) => {
      expect(URL_REGEXP.test(url)).toBe(true)
    })
  })

  it('should reject invalid URLs', () => {
    const invalidUrls = [
      '',
      'example.com',
      'http://example.com',
      'https://',
      'https://example',
      'https://example.',
      'https://.com',
      'ftp://example.com',
      'https://example.com/path?query=1',
      'https://example.com/path#hash',
      'https://example.com/path/to/page.html',
    ]

    invalidUrls.forEach((url) => {
      expect(URL_REGEXP.test(url)).toBe(false)
    })
  })
})
