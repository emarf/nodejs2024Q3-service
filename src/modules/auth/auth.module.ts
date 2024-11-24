import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/modules/auth/strategies/local-strategy';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt-strategy';
import { LoginValidationMiddleware } from 'src/middlewares/login.middleware';
import { RefreshStrategy } from 'src/modules/auth/strategies/refresh-strategy';
import { LoggerService } from 'src/modules/logger/logger.service';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    LoggerService,
  ],
  exports: [JwtModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginValidationMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
