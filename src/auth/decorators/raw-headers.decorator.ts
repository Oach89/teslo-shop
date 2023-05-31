import {
	ExecutionContext,
	InternalServerErrorException,
	createParamDecorator,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator(
	(data, ctx: ExecutionContext) => {
		// console.log({ data });
		const req = ctx.switchToHttp().getRequest();
		const rawHeaders = req.rawHeaders;
		if (!rawHeaders) {
			throw new InternalServerErrorException('rawHeaders not found (request)');
		}
		return rawHeaders;
	},
);
