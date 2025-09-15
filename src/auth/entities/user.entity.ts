import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../interfaces/roles.interface";
import { Orden } from "src/orden/entities/orden.entity";
import { UserImage } from "src/files/entities/file.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    fullName: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.user
    })
    rol: string;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    @OneToMany(
        () => Orden,
        (orden) => orden.user
    )
    orden: Orden;


    @OneToOne(
        () => UserImage,
        (image) => image.user,
        {cascade: true, eager: true}
    )
    image: UserImage;

    @BeforeUpdate()
    beforeUpdateFullName(){
        this.fullName = this.fullName.toLowerCase().trim();
    }

    @BeforeInsert()
    beforeInsertFullName(){
        this.fullName = this.fullName.toLowerCase().trim();
    }
}
