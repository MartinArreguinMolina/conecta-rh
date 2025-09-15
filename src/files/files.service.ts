import { BadRequestException, Injectable } from '@nestjs/common';

import { join } from 'path';

import { existsSync, unlinkSync } from 'fs';



@Injectable()

export class FilesService {


    getStaticUserIMage(imageName: string) {
        const path = join(__dirname, '../../static/user-image', imageName)


        if (!existsSync(path)) {
            throw new BadRequestException(`No product found with image ${imageName}`)
        }


        return path;
    }



    deleteUserImage(imageName: string) {
        const path = join(__dirname, '../../static/user-image', imageName);
        if (existsSync(path)) {
            try {
                unlinkSync(path);
                return {
                    message: 'la imagen a sido eliminada'
                }
            } catch (err) {
                throw new BadRequestException(`La imagen no pudo ser eliminada: ${err}`);
            }
        }
    }



}