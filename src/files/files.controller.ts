import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
	Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService,
	) {}

	@Get('product/:imageName')
	findFileProduct(@Res() res: Response, @Param('imageName') imageName: string) {
		const patch = this.filesService.getStaticProductoImage(imageName);
		res.sendFile(patch);
	}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: fileFilter,
			// limits: { fileSize: 1000 },
			storage: diskStorage({
				destination: './static/products',
				filename: fileNamer,
			}),
		}),
	)
	uploadFile(
		@UploadedFile()
		file: Express.Multer.File,
	) {
		if (!file) {
			throw new BadRequestException('Make sure that the file is an image');
		}
		const hostApi = this.configService.get('HOST_API');
		const secureUrl = `${hostApi}/files/product/${file.filename}`;
		return { secureUrl };
	}
}
