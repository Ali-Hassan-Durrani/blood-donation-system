import { Test, TestingModule } from '@nestjs/testing';
import { BloodBankController } from './blood-bank.controller';

describe('BloodBankController', () => {
  let controller: BloodBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloodBankController],
    }).compile();

    controller = module.get<BloodBankController>(BloodBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
