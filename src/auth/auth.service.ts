import { UserImage } from 'src/files/entities/file.entity';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { PayloadJwt } from './interfaces/payload.interface';
import { isUUID } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';
import { HandleErrors } from 'src/common/erros/handleErrors';
import { FilesService } from 'src/files/files.service';

interface userPlane {
  id: string,
  fullName: string,
  email: string,
  rol: string,
  isActive: string,
  image: string;
}

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserImage)
    private readonly userImageRepository: Repository<UserImage>,

    private readonly fileService: FilesService,

    private readonly jwtService: JwtService,

    private readonly dataSource: DataSource
  ) { }


  async create(createAuthDto: CreateUserDto) {
    try {
      const { userImage, password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        password: bcrypt.hashSync(password, 10),
        ...userData,
        image: this.userImageRepository.create({ image: userImage })
      });

      await this.userRepository.save(user)

      return {
        ...user,
        image: userImage,
        token: this.getJwtToken({
          id: user.id,
          email: user.email
        })
      }
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } })

    if(!user?.isActive)
      throw new BadRequestException('No estas activo')


    if (!user)
      throw new UnauthorizedException('El email no coincide')


    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('La contraseña no coincide')

    const { password: userPassword, ...userWithoutPassword } = user;
    const { image } = user.image

    return {
      ...userWithoutPassword,
      image: image,
      token: this.getJwtToken({ email: user.email, id: user.id })
    }
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ email: user.email, id: user.id })
    }
  }

  async findAll() {
    const users = await this.userRepository.find();

    // No se pueden resolver muchos await al mismo tiempo por eso se utiliza promise.all()
    const currentUser = users.map(async (user) => {
      return await this.planeUser(user)
    })


    const usersReponse = Promise.all(currentUser);

    return usersReponse;
  }

  async findOne(term: string) {
    let user: User | null = null;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user')
      user = await queryBuilder
      .leftJoinAndSelect('user.image', 'image')
        .where('user.fullName=:fullName or user.email=:email', {
          fullName: term.toLowerCase().trim(),
          email: term
        }).getOne()
    }

    if (!user)
      throw new NotFoundException('El usuario no fue enconrtrado')


    return user;
  }


  async planeUserReponse(term: string) {
    const user = await this.findOne(term);

    return this.planeUser(user)
  }

  async planeUser(user: User) {
    const { password, image, ...userValues } = user;

    return {
      ...userValues,
      image: image.image
    }
  }

  async fidOneUserImage(url: string) {
    let userImage: UserImage | null = null;

    userImage = await this.userImageRepository.findOneBy({ image: url })

    if (!userImage)
      throw new NotFoundException('la imagen no fue encontrada');


    return userImage;
  }


  async remove(id: string) {
    const user = await this.findOne(id)
    const { image } = user.image;
    const userImage = await this.fidOneUserImage(image)
    const imageUrl = user.image.image.split('/').slice(-1)[0];

    try {
      await this.userRepository.remove(user)
      await this.userImageRepository.remove(userImage);
      this.fileService.deleteUserImage(imageUrl)

      return 'Usuario eliminado exitosamente';
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    if (updateUserDto.password) {
      const password = updateUserDto.password;
      updateUserDto.password = bcrypt.hashSync(password, 10);
    }

    const currentUser = await this.findOne(id)
    const imageToDelete = currentUser.image.image.split('/').slice(-1)[0]

    const { userImage, ...toUpdate } = updateUserDto;


    const user = await this.userRepository.preload({ id, ...toUpdate });

    if (!user)
      throw new NotFoundException('El usuario no fue encontrado')

    const quereRunner = this.dataSource.createQueryRunner()

    await quereRunner.connect()

    await quereRunner.startTransaction()

    try {
      if (userImage) {

        if(imageToDelete){
          this.fileService.deleteUserImage(imageToDelete)
        }

        await quereRunner.manager.delete(UserImage, { user: { id } })

        user.image = this.userImageRepository.create({ image: userImage })
      }

      await quereRunner.manager.save(user)

      await quereRunner.commitTransaction();

      // const userdb = await this.userRepository.save(user);
      
      return this.planeUserReponse(id)
    } catch (error) {
      await quereRunner.rollbackTransaction()
      HandleErrors.handleDBErrors(error)
    }finally{
      await quereRunner.release()
    }
  }

  private getJwtToken(payloadJwt: PayloadJwt) {
    const jwt = this.jwtService.sign(payloadJwt);
    return jwt;
  }

}
