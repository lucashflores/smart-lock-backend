import { Test, TestingModule } from '@nestjs/testing';
import { UserLockRelationService } from '../../src/services/user-lock-relation.service';

describe('UserLockRelationService', () => {
  let service: UserLockRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLockRelationService],
    }).compile();

    service = module.get<UserLockRelationService>(UserLockRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
