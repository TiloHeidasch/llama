import { Module } from '@nestjs/common';

import { LlamaController } from './llama/llama.controller';
import { LlamaService } from './llama/llama.service';

@Module({
  imports: [],
  controllers: [LlamaController],
  providers: [LlamaService],
})
export class AppModule { }
