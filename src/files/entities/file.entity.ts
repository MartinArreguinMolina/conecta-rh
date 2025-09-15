import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';


@Entity()
export class UserImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text')
    image: string;


    @OneToOne(
        () => User,
        (user) => user.image,
        {onDelete: 'CASCADE'}
    )
    @JoinColumn()
    user: User
}
