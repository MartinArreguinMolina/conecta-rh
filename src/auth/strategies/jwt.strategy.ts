import {Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadJwt } from "../interfaces/payload.interface";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET')!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: PayloadJwt): Promise<User> {
        const {id, email} = payload;
        let user : User | null = null;

        const queryBuilder = this.userRepository.createQueryBuilder('user')
        user = await queryBuilder.where('user.id=:id or user.email=:email',{
            id,
            email
        }).getOne()

        if(!user)
            throw new NotFoundException('El token no es valido')

        if(!user.isActive)
            throw new UnauthorizedException('El usuario esta inactivo hable con el administrador')

        return user;
    }

}