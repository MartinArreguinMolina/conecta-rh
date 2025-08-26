import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { Roles } from 'src/auth/interfaces/roles.interface';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // Todos los roles pueden crear un cliente
  @Post()
  @Auth()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.clientService.findOne(term);
  }

  // Todos los roles pueden crear un cliente
  @Auth()
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }


  // Todos los roles pueden borrar un cliente 
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
