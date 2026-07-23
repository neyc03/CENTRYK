import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as authenticator from 'otplib';
import * as qrcode from 'qrcode';
import { PlatformUser, UserRole } from '../../entities/PlatformUser.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateTwoFactorSecret(email: string) {
    const secret = authenticator.authenticator.generateSecret();
    const otpauthUrl = authenticator.authenticator.keyuri(email, 'Centryx MDM', secret);
    return { secret, otpauthUrl };
  }

  async generateQrCodeDataUrl(otpauthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpauthUrl);
  }

  verifyTwoFactorToken(token: string, secret: string): boolean {
    return authenticator.authenticator.verify({ token, secret });
  }

  generateJwtToken(user: Partial<PlatformUser>) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyId: user.companyId,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    };
  }
}
