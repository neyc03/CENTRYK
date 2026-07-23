import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'ws/remote-control',
})
export class RemoteControlGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RemoteControlGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente o Dispositivo conectado a canal WebSocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente o Dispositivo desconectado de WebSocket: ${client.id}`);
  }

  // Comando remoto: Bloquear Dispositivo
  @SubscribeMessage('command:lock_device')
  handleLockDevice(client: Socket, payload: { deviceId: string; reason?: string }) {
    this.logger.warn(`Ejecutando Bloqueo Remoto para Dispositivo: ${payload.deviceId}`);
    
    // Emitir instrucción inmediata al agente Android conectado
    this.server.emit(`device:${payload.deviceId}:command`, {
      action: 'LOCK_IMMEDIATE',
      reason: payload.reason || 'Bloqueo administrativo por supervisor',
      timestamp: new Date().toISOString(),
    });

    return { success: true, message: `Comando de bloqueo enviado al dispositivo ${payload.deviceId}` };
  }

  // Comando remoto: Hacer Sonar Sirena
  @SubscribeMessage('command:ring_siren')
  handleRingSiren(client: Socket, payload: { deviceId: string; durationSeconds: number }) {
    this.logger.log(`Haciendo sonar sirena remota en: ${payload.deviceId}`);
    
    this.server.emit(`device:${payload.deviceId}:command`, {
      action: 'RING_SIREN',
      durationSeconds: payload.durationSeconds || 30,
      timestamp: new Date().toISOString(),
    });

    return { success: true, message: `Sirena activada por ${payload.durationSeconds}s` };
  }
}
