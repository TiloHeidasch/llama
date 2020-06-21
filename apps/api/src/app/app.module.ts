import { Module } from '@nestjs/common';

import { LlamaController } from './llama/llama.controller';
import { LlamaService } from './llama/llama.service';
import { CategoryController } from './category/category.controller';
import { ItemNameController } from './category/item-name.controller';
import { CategoryService } from './category/category.service';

@Module({
  imports: [],
  controllers: [LlamaController, CategoryController, ItemNameController],
  providers: [LlamaService, CategoryService],
})
export class AppModule { }
