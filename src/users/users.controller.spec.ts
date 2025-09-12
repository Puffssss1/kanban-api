import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/common/types';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    findAll: jest.fn().mockReturnValue([
      {
        id: '1',
        full_name: 'Test User',
        avatar_url: 'http://example.com/avatar.png',
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all user', () => {
    expect(controller.findAll()).toEqual([
      {
        id: expect.any(String),
        full_name: expect.any(String),
        avatar_url: expect.any(String),
      },
    ]);
  });

  it('should get the user', () => {
    const mockRequest = {
      user: {
        id: '11ac49ed-b1b9-4544-bcae-d477a845195c',
        email: 'test@example.com',
      },
    } as unknown as AuthenticatedRequest;
    expect(controller.findMe(mockRequest)).toEqual({
      id: expect.any(String),
      email: expect.any(String),
    });
  });
});
