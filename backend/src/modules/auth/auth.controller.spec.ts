import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ObjectId } from 'mongodb';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const authRegisterDto: AuthRegisterDto = { username: 'newuser', password: 'newpassword', role: UserRole.USER };
      const newUser: UserDocument = { _id: new ObjectId(), username: 'newuser', password: 'hashedpassword', role: UserRole.USER, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' } as unknown as UserDocument;
      jest.spyOn(service, 'register').mockResolvedValue(newUser);

      expect(await controller.register(authRegisterDto)).toBe(newUser);
      expect(service.register).toHaveBeenCalledWith(authRegisterDto);
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const authLoginDto: AuthLoginDto = { username: 'testuser', password: 'testpassword' };
      const user: UserDocument = { _id: new ObjectId(), username: 'testuser', password: 'hashedpassword', role: UserRole.USER, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' } as unknown as UserDocument;
      const accessToken = { accessToken: 'mockAccessToken' };

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest.spyOn(service, 'login').mockResolvedValue(accessToken);

      expect(await controller.login(authLoginDto)).toBe(accessToken);
      expect(service.validateUser).toHaveBeenCalledWith(authLoginDto.username, authLoginDto.password);
      expect(service.login).toHaveBeenCalledWith(user);
    });

    it('should return a message for invalid credentials', async () => {
      const authLoginDto: AuthLoginDto = { username: 'wrong', password: 'credentials' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(undefined);

      expect(await controller.login(authLoginDto)).toEqual({ message: 'Invalid credentials' });
      expect(service.validateUser).toHaveBeenCalledWith(authLoginDto.username, authLoginDto.password);
      expect(service.login).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const req = { user: { userId: 'someId', username: 'testuser', role: UserRole.ADMIN } };
      expect(controller.getProfile(req)).toBe(req.user);
    });
  });
});
