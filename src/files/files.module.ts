import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { UserImage } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
        // Debemos de importar las entidades
    TypeOrmModule.forFeature([UserImage]),
    ConfigModule
  ],

  exports: [TypeOrmModule, FilesService]
})
export class FilesModule {}
