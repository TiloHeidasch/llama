import { Test, TestingModule } from '@nestjs/testing';
import { LlamaController } from './llama.controller';

describe('Llama Controller', () => {
  let controller: LlamaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LlamaController],
    }).compile();

    controller = module.get<LlamaController>(LlamaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
