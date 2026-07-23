import { Module } from '@nestjs/common';
import { RemoteControlGateway } from './remote-control.gateway';

@Module({
  providers: [RemoteControlGateway],
  exports: [RemoteControlGateway],
})
export class RemoteControlModule {}
