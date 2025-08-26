import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { Auth } from 'src/auth/decorators/auth-decorator';

@Controller('orden')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  @Auth()
  create(@Body() createOrdenDto: CreateOrdenDto) {
    return this.ordenService.create(createOrdenDto);
  }

  @Get()
  findAll() {
    return this.ordenService.findAll();
  }

  @Get('client/:term')
  findOneByClient(@Param('term') term: string) {
    return this.ordenService.findOneByClient(term);
  }

  @Get('user/:term')
  findOneByUser(@Param('term') term: string) {
    return this.ordenService.findOneByUser(term);
  }

  @Get(':id')
  findOneOrden(@Param('id', ParseUUIDPipe) id: string){
    return this.ordenService.findOneOrden(id)
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrdenDto: UpdateOrdenDto) {
    return this.ordenService.update(id, updateOrdenDto);
  }


  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.ordenService.remove(id);
  }
}
