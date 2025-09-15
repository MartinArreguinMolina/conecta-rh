import { BadRequestException, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,


    private readonly configService: ConfigService
  ) {}


  // Esta funcion retorna la imagen
  @Get('user-image/:imageName')
  findAll(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
   const path = this.filesService.getStaticUserIMage(imageName);


  //  Esta funcion regresa la imagen tal cual
   res.sendFile(path)
  }


  @Post('user-image')
  @UseInterceptors(
    FileInterceptor('file', {
      // Verifica que la imegen cumpla con las extenciones
      fileFilter: fileFilter,


      storage: diskStorage({
        destination: './static/user-image',

        filename: fileNamer
      })
    })
  )
  uploadUserImage(
    @UploadedFile()
    file: Express.Multer.File
  ){
    if(!file){
      throw new BadRequestException('El archivo debe de ser una imagen')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/user-image/${file.filename}`

    return {
      secureUrl
    }
  }


  @Delete('user-image/:path')
  deleteImage(@Param('path') path: string){
    return this.filesService.deleteUserImage(path)
  }
}
