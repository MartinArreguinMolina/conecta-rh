import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrdenStatus } from "../interfaces/orden-status.interface";
import { Client } from "src/client/entities/client.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Orden {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: OrdenStatus,
        default: OrdenStatus.espera
    })
    status: OrdenStatus;


    @Column('text')
    deviceType: string;


    @Column('text')
    description: string;


    @Column('float', {
        default: 0
    })
    price: number;
    
    @ManyToOne(
        () => Client,
        (client) => client.client,
        {eager: true}
    )
    client: Client

    @ManyToOne(
        () => User,
        (user) => user.orden,
        {eager: true}
    )
    user: User

}
