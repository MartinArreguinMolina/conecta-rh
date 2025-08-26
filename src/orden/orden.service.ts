import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { Repository } from 'typeorm';
import { Orden } from './entities/orden.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { isUUID } from 'class-validator';
import { HandleErrors } from '../common/erros/handleErrors';

@Injectable()
export class OrdenService {
  constructor(

    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,


    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

  ) { }

  async create(createOrdenDto: CreateOrdenDto) {

    try {
      const user = await this.userRepository.findOneByOrFail({ id: createOrdenDto.userId })
      const client = await this.clientRepository.findOneByOrFail({ id: createOrdenDto.clientId })

      const orden = this.ordenRepository.create({
        client,
        user,
        description: createOrdenDto.description,
        status: createOrdenDto.ordenStatus,
        price: createOrdenDto.price,
        deviceType: createOrdenDto.typeDevice,
      })

      return await this.ordenRepository.save(orden);
    } catch (error) {
      console.log(error)
      HandleErrors.handleDBErrors(error)
    }
  }

  async findAll() {
    return await this.ordenRepository.find()
  }

  private async findOne(entity: string, term: string){
    let orders: Orden[] | null = null;

    const queryBuilder = this.ordenRepository.createQueryBuilder('ord')
    queryBuilder.leftJoinAndSelect(`ord.${entity}`, `${entity}`)

    if (isUUID(term)) {
      orders = await queryBuilder.where(`${entity}.id=:id`, { id: term }).getMany()
    } else {
      orders = await queryBuilder.where(`LOWER(${entity}.fullName)=:fullName`, { fullName: term.toLowerCase().trim() }).getMany()
    }

    if (!orders || orders.length === 0)
      throw new NotFoundException(`No existen ordenes con el parametro ${term}`)

    return orders;

  }

  async findOneByClient(term: string) {
    return this.findOne('client', term);
  }

  async findOneByUser(term: string) {
    return this.findOne('user', term)
  }

  async findOneOrden(id: string){
    let orden: Orden | null = null;

    orden = await  this.ordenRepository.findOne({where: {
      id: id
    }})

    if(!orden)
      throw new NotFoundException('la orden no a sido encontrado')

    return orden;
  }

  async update(id: string, updateOrdenDto: UpdateOrdenDto) {

    let user: User | null = null;
    let client: Client | null = null;

    try{
        user = await this.userRepository.findOneByOrFail({ id: updateOrdenDto.userId })
        client = await this.clientRepository.findOneByOrFail({ id: updateOrdenDto.clientId })
    }catch(error){
      HandleErrors.handleDBErrors(error);
    }

    const orden = await this.ordenRepository.preload({
      id,
      user,
      client,
      ...updateOrdenDto
    })

    if (!orden)
      throw new NotFoundException('La orden no fue encontrada');

    try {
      await this.ordenRepository.save(orden)
      return orden;
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async remove(id: string) {
    const orden = await this.findOneOrden(id)
    
    try{
      await this.ordenRepository.delete(orden);
      return `la orden con el id ${id} a sido eliminada exitosamente`
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }
}
