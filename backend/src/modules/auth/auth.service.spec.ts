import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User, UserRole } from './user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersRepository: Repository<User>;
 
  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockAccessToken'),
          }, 
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  }); 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser: User = { id: new ObjectId(), username: 'testuser', password: hashedPassword, role: UserRole.USER, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
 
      const result = await service.validateUser('testuser', 'password123') as User;
      expect(result).toEqual(expect.objectContaining({ username: 'testuser', role: UserRole.USER }));
      expect(result).not.toHaveProperty('password');
    });

    it('should return null for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser: User = { id: new ObjectId(), username: 'testuser', password: hashedPassword, role: UserRole.USER, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
 
      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      const result = await service.validateUser('nonexistent', 'password');
      expect(result).toBeNull();
    }); 
  }); 

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { id: new ObjectId(), username: 'testuser', role: UserRole.USER };
      const result = await service.login(mockUser);
 
      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: mockUser.username, sub: mockUser.id, role: mockUser.role });
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const authRegisterDto: AuthRegisterDto = { username: 'newuser', password: 'newpassword', role: UserRole.USER };
      const hashedPassword = 'hashedpassword';
      const mockUser: User = { id: new ObjectId(), username: 'newuser', password: hashedPassword, role: UserRole.USER, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.register(authRegisterDto);
      expect(result).toBe(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(usersRepository.create).toHaveBeenCalledWith({ username: 'newuser', password: hashedPassword, role: UserRole.USER });
      expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
    });
  }); 
});
