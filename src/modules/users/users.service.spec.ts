import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUserModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            ...mockUserModel,
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('return all users if no start param', async () => {
      const execMock = jest.fn().mockResolvedValue([{ name: 'Facundo' }]);
      userModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getUsers();
      expect(result).toEqual([{ name: 'Facundo' }]);
    });

    it('return filtered users if start param is provided', async () => {
      const execMock = jest.fn().mockResolvedValue([{ name: 'Facundo' }]);
      userModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getUsers('Fa');
      expect(userModel.find).toHaveBeenCalledWith({
        name: { $regex: '^Fa', $options: 'i' },
      });
      expect(result).toEqual([{ name: 'Facundo' }]);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const dto = {
        name: 'Facundo',
        email: 'facundo@example.com',
        birthDate: '1992-01-01',
      };
      userModel.updateOne.mockResolvedValue({ matchedCount: 1 });

      const result = await service.updateUser(dto as any);
      expect(result).toBe(true);
      expect(userModel.updateOne).toHaveBeenCalled();
    });

    it('should call createUser if user not found', async () => {
      const dto = {
        name: 'Ariel',
        email: 'ariel@example.com',
        birthDate: '1992-01-01',
      };
      userModel.updateOne.mockResolvedValue({ matchedCount: 0 });
      jest.spyOn(service, 'createUser').mockResolvedValue(true);

      const result = await service.updateUser(dto as any);
      expect(service.createUser).toHaveBeenCalledWith(dto);
      expect(result).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('delete the user and return true', async () => {
      userModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
      const result = await service.deleteUser('facundo@example.com');
      expect(result).toBe(true);
    });

    it('should return false if user not found', async () => {
      userModel.deleteOne.mockResolvedValue({ deletedCount: 0 });
      const result = await service.deleteUser('facundo@example.com');
      expect(result).toBe(false);
    });
  });
});
