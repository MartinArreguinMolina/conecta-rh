import { Roles } from "src/auth/interfaces/roles.interface";
import * as bcrypt from 'bcrypt'


interface Createusers{
    fullName: string,
    email: string,
    password: string,
    rol: Roles,
    userImage: string
}

export class Seed {
    static users: Createusers[] = [
        {
            fullName: 'Martin Arreguin Molina',
            email: 'arrec7281@gmail.com',
            password: bcrypt.hashSync('db9908b54QWE', 10),
            rol: Roles.superAdmin,
            userImage: 'http://localhost:3000/api/files/user-image/898e5319-0f5f-4d64-aa8e-eb0cf3615668.jpeg'
        },
          {
            fullName: 'Carlos Arrguin Molina',
            email: 'carlos@gmail.com',
            password: bcrypt.hashSync('j9hh8in989A9', 10),
            rol: Roles.admin,
            userImage: 'http://localhost:3000/api/files/user-image/0bb27457-c0cf-4023-889a-b28a127c4e34.jpeg'
        },
          {
            fullName: 'Ana Karla Bernal Lopez',
            email: 'anakarlabernallopez@gmail.com',
            password: bcrypt.hashSync('ij99j99K9....', 10),
            rol: Roles.user,
            userImage: 'http://localhost:3000/api/files/user-image/c7a8162c-4725-4307-9e6e-25e7a99a5a3e.jpeg'
        },
    ]
}