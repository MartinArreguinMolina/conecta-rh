import {Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import {Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { HandleErrors } from 'src/common/erros/handleErrors';

@Injectable()
export class ClientService {

  constructor(

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ){}

  async create(createClientDto: CreateClientDto) {
    try{
      const client = this.clientRepository.create(createClientDto);
      await this.clientRepository.save(client);
      return client;
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }

  async findAll() {
    return this.clientRepository.find()
  }

  async findOne(term: string) {
    let client: Client | null = null;

    if(isUUID(term)){
      client = await this.clientRepository.findOneBy({id: term});
    }else{
      const queryBuilder = this.clientRepository.createQueryBuilder('cli');
      client = await queryBuilder.where('cli.fullName=:fullName or cli.phoneNumber=:phoneNumber',{
        fullName: term.toLowerCase().trim(),
        phoneNumber: term,
      }).getOne()
    }


    if(!client) throw new NotFoundException('No se encontro al cliente')


    return client;
  }

 async update(id: string, updateClientDto: UpdateClientDto) {
   const client = await this.clientRepository.preload({id, ...updateClientDto});
   
   if(!client) throw new NotFoundException('No se encontro el cliente');
   
    try{
      return await this.clientRepository.save(client)
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }

  async remove(id: string) {
    const client = await this.findOne(id)

    try{
      await this.clientRepository.remove(client);

      return 'cliente borrado correctamente'
    }catch(error){
      HandleErrors.handleDBErrors(error);
    }
  }
}
