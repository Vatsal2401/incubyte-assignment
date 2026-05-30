import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { QueryEmployeesDto } from './query-employees.dto';

function parse(payload: Record<string, unknown>): {
  dto: QueryEmployeesDto;
  invalid: string[];
} {
  const dto = plainToInstance(QueryEmployeesDto, payload);
  const invalid = validateSync(dto, { whitelist: true }).map((e) => e.property);
  return { dto, invalid };
}

describe('QueryEmployeesDto', () => {
  it('coerces numeric query strings into numbers', () => {
    const { dto, invalid } = parse({ page: '3', pageSize: '20', salaryMin: '100000' });

    expect(invalid).toHaveLength(0);
    expect(dto.page).toBe(3);
    expect(dto.pageSize).toBe(20);
    expect(dto.salaryMin).toBe(100000);
  });

  it('rejects a pageSize above the maximum', () => {
    expect(parse({ pageSize: '500' }).invalid).toContain('pageSize');
  });

  it('rejects a page below 1', () => {
    expect(parse({ page: '0' }).invalid).toContain('page');
  });

  it('accepts an empty query', () => {
    expect(parse({}).invalid).toHaveLength(0);
  });
});
