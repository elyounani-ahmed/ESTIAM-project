import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
//import { AuthService } from 'src/auth/services/auth.service';


@Module({
    imports: [
        TypeOrmModule.forFeature ([UserEntity]),
        AuthModule
      //  AuthService 
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]

})
export class UserModule {}
