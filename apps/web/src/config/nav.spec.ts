import { isActivePath } from './nav';

describe('isActivePath', () => {
  it('matches the dashboard root exactly', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/employees', '/')).toBe(false);
  });

  it('matches an exact section path', () => {
    expect(isActivePath('/employees', '/employees')).toBe(true);
  });

  it('matches nested paths under a section', () => {
    expect(isActivePath('/employees/emp_1', '/employees')).toBe(true);
  });

  it('does not match a different section', () => {
    expect(isActivePath('/analytics', '/employees')).toBe(false);
  });
});
