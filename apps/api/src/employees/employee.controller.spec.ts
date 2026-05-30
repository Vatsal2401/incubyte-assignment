import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

const dto = {
  name: 'Ada Lovelace',
  email: 'ada@acme.io',
  jobTitle: 'Staff Engineer',
  department: 'Engineering',
  country: 'GB',
  currency: 'GBP' as const,
  salaryMinor: 9_000_000,
  hireDate: '2020-01-01T00:00:00.000Z',
};

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: {
    create: ReturnType<typeof vi.fn>;
    list: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    deactivate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    service = {
      create: vi.fn(),
      list: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    controller = new EmployeeController(service as unknown as EmployeeService);
  });

  it('creates an employee, converting hireDate to a Date', async () => {
    service.create.mockResolvedValue({ id: 'emp_1' });

    await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ hireDate: new Date(dto.hireDate), email: dto.email }),
    );
  });

  it('delegates listing to the service', async () => {
    const page = { items: [], total: 0, page: 1, pageSize: 25 };
    service.list.mockResolvedValue(page);

    const result = await controller.list({ country: 'IN' });

    expect(service.list).toHaveBeenCalledWith({ country: 'IN' });
    expect(result).toBe(page);
  });

  it('delegates deactivation to the service', async () => {
    service.deactivate.mockResolvedValue({ id: 'emp_1', status: 'inactive' });

    await controller.deactivate('emp_1');

    expect(service.deactivate).toHaveBeenCalledWith('emp_1');
  });
});
