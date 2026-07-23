import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email?: string; password?: string }) {
    // Demostración inicial del endpoint de autenticación
    if (!body.email || !body.password) {
      return { success: false, message: 'Email y contraseña requeridos' };
    }

    return {
      success: true,
      message: 'Credenciales válidas. Si requiere 2FA, proporcione el token TOTP.',
      requiresTwoFactor: true,
    };
  }

  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  async verify2fa(@Body() body: { email: string; token: string; secret: string }) {
    const isValid = this.authService.verifyTwoFactorToken(body.token, body.secret);
    return { success: isValid, message: isValid ? '2FA Verificado' : 'Código 2FA inválido' };
  }
}
