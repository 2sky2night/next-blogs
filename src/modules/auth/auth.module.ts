import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "@/modules/user/user.module";
import { AuthService } from "@/modules/auth/auth.service";
import { AuthController } from "@/modules/auth/auth.controller";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SERCERT,
      signOptions: {
        expiresIn: "7d",
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
