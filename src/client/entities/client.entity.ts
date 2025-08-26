import { Orden } from "src/orden/entities/orden.entity";
import { AfterInsert, AfterUpdate, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'client'})
export class Client {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    fullName: string;

    @Column('text')
    address: string

    @Column('text')
    phoneNumber: string

    @Column('text', {
        unique: true,
        nullable: true
    })
    email: string;


    @OneToMany(
        () => Orden,
        (orden) => orden.client,
        {cascade: true}
    )
    client: Orden

    @BeforeInsert()
    beforeInsertName(){
        this.fullName = this.fullName.toLowerCase().trim()
    }

    @BeforeUpdate()
    beforeUpdateName(){
        this.fullName = this.fullName.toLowerCase().trim()
    }
}
