import { Test, TestingModule } from '@nestjs/testing';
import { BloodRequestController } from './blood-request.controller';

describe('BloodRequestController', () => {
  let controller: BloodRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloodRequestController],
    }).compile();

    controller = module.get<BloodRequestController>(BloodRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
