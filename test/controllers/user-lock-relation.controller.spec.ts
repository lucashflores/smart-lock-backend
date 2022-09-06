import { Test, TestingModule } from '@nestjs/testing';
import { UserLockRelationController } from '../../src/controllers/user-lock-relation.controller';
import { UserLockRelationService } from '../../src/services/user-lock-relation.service';

describe('UserLockRelationController', () => {
  let controller: UserLockRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLockRelationController],
      providers: [UserLockRelationService],
    }).compile();

    controller = module.get<UserLockRelationController>(
      UserLockRelationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
