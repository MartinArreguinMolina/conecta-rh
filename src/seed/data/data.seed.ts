import { Roles } from "src/auth/interfaces/roles.interface";
import * as bcrypt from 'bcrypt'


interface Createusers{
    fullName: string,
    email: string,
    password: string,
    rol: Roles
}

export class Seed {
    static users: Createusers[] = [
        {
            fullName: 'Martin Arreguin Molina',
            email: 'arrec7281@gmail.com',
            password: bcrypt.hashSync('db9908b54QWE', 10),
            rol: Roles.superAdmin
        },
          {
            fullName: 'Carlos Arrguin Molina',
            email: 'carlos@gmail.com',
            password: bcrypt.hashSync('j9hh8in989A9', 10),
            rol: Roles.admin
        },
          {
            fullName: 'Ana Karla Bernal Lopez',
            email: 'anakarlabernallopez@gmail.com',
            password: bcrypt.hashSync('ij99j99K9....', 10),
            rol: Roles.user
        },
    ]
}