import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { PayloadJwt } from './interfaces/payload.interface';
import { isUUID } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';
import { HandleErrors } from 'src/common/erros/handleErrors';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ){}


  async create(createAuthDto: CreateUserDto) {
    try{
      const {password, ...userData} = createAuthDto;

      const user = this.userRepository.create({
        password: bcrypt.hashSync(password, 10),
        ...userData
      });

      await this.userRepository.save(user)

      return {
        ...user,
        token: this.getJwtToken({
          id: user.id,
          email: user.email
        })
      }
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto){
    const {email, password} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, fullName: true, id: true, password: true}
    })

    
    if(!user)
      throw new UnauthorizedException('El email no coincide')


    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('La contraseña no coincide')


    return {
      ...user,
      token: this.getJwtToken({email: user.email, id: user.id})
    }
  }

  async checkAuthStatus(user: User){
    return {
      ...user,
      token: this.getJwtToken({email: user.email, id: user.id})
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(term: string) {
    let user: User | null = null;

    if(isUUID(term)){
      user = await this.userRepository.findOneBy({id: term});
    }else{
      const queryBuilder = this.userRepository.createQueryBuilder('user')
      user = await queryBuilder.where('user.fullName=:fullName or user.email=:email', {
        fullName: term.toLowerCase().trim(),
        email: term
      }).getOne()
    }

    if(!user)
      throw new NotFoundException('El usuario no fue enconrtrado')


    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id)

    try{
      await this.userRepository.remove(user)

      return 'Usuario eliminado exitosamente';
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto){

    if(updateUserDto.password){
      const password = updateUserDto.password;
      updateUserDto.password = bcrypt.hashSync(password, 10);
    }
    
    const user = await this.userRepository.preload({id,  ...updateUserDto});

    if(!user)
      throw new NotFoundException('El usuario no fue encontrado')


    try{
      const userdb = await this.userRepository.save(user);  

      return {
        ...userdb,
        token: this.getJwtToken({id: userdb.id, email: userdb.email})
      }
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }


  private getJwtToken(payloadJwt: PayloadJwt){
    const jwt = this.jwtService.sign(payloadJwt);
    return jwt;
  }

}
