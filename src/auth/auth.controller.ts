import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth-decorator';
import { Roles } from './interfaces/roles.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.docorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Los roles de administrador y superAdmin pueden crear usuarios nuevos
  @Post('create')
  @Auth(Roles.admin, Roles.superAdmin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('check-status')
  @Auth()
  checkStatus(
      @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.authService.planeUserReponse(term);
  }

  // Solo los roles de superAdmin pueden actualizar usuarios
  @Patch('update/:id')
  @Auth(Roles.superAdmin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  // Solo los rolos de superAdmin pueden eliminar usuarios
  @Delete(':id')
  @Auth(Roles.superAdmin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
