import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest()

        const user = req.user;
        const {password, image, ...userValues} = user;

        const userResponse = {
            ...userValues,
            image: image.image
        }

        if(!user)
            throw new NotFoundException('el usuario no fue encontrado')

        return (!data) ? userResponse : userResponse[data]
    }
)