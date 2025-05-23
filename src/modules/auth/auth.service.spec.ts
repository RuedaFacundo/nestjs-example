import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './schemas/auth-user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let authUserModel: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockAuthUserModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(AuthUser.name),
          useValue: mockAuthUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authUserModel = module.get(getModelToken(AuthUser.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should hash the password and save the user', async () => {
      const registerDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const saveMock = jest.fn().mockResolvedValue({ username: 'testuser' });

      const mockAuthUserInstance = {
        ...registerDto,
        password: hashedPassword,
        save: saveMock,
      };

      const authUserModelConstructor = jest
        .fn()
        .mockImplementation(() => mockAuthUserInstance);
      service = new AuthService(
        authUserModelConstructor as any,
        new JwtService({} as any),
      );

      const result = await service.register(registerDto);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ username: 'testuser' });
    });
  });
});
