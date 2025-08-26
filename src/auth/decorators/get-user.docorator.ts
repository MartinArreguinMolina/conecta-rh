import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';


export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest()
        const user = req.user;

        if(!user)
            throw new NotFoundException('el usuario no fue encontrado')

        return (!data) ? user : user[data]
    }
)