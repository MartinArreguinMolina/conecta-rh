import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { OrdenModule } from './orden/orden.module';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      autoLoadEntities: true,
      synchronize: true
    }),

    ClientModule,

    AuthModule,

    SeedModule,

    OrdenModule,

    CommonModule,

    FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
