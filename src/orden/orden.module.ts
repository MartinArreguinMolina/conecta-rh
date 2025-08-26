import { Module } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/auth/entities/user.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [OrdenController],
  providers: [OrdenService],
  imports: [
    TypeOrmModule.forFeature([Orden, Client, User]),

    AuthModule,

    CommonModule
  ]
})
export class OrdenModule {}
