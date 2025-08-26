import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const rep = ctx.switchToHttp().getRequest()
        const rawHeaders = rep.rawHeaders;

        if(!rawHeaders)
            throw new InternalServerErrorException('El usuario no fue encontrado')

        return rawHeaders;
    }
)