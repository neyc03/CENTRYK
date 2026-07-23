import { Module } from '@nestjs/common';
import { FocusIndexService } from './focus-index.service';
import { FocusIndexController } from './focus-index.controller';

@Module({
  controllers: [FocusIndexController],
  providers: [FocusIndexService],
  exports: [FocusIndexService],
})
export class FocusIndexModule {}
