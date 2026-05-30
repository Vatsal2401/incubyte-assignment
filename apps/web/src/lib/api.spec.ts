import { toQueryString } from './api';

describe('toQueryString', () => {
  it('serializes defined params', () => {
    expect(toQueryString({ page: 2, pageSize: 25, country: 'IN' })).toBe(
      'page=2&pageSize=25&country=IN',
    );
  });

  it('omits undefined and empty-string params', () => {
    expect(toQueryString({ page: 1, country: '', search: undefined })).toBe('page=1');
  });

  it('returns an empty string for no params', () => {
    expect(toQueryString({})).toBe('');
  });
});
