import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valide-roles.interface';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@Post()
	@Auth()
	create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
		return this.productService.create(createProductDto, user);
	}

	@Get()
	@Auth()
	findAll(@Query() pagination: PaginationDto) {
		console.log(pagination);
		return this.productService.findAll(pagination);
	}

	@Get(':term')
	findOne(@Param('term') term: string) {
		return this.productService.findOnePlain(term);
	}

	@Patch(':id')
	@Auth(ValidRoles.admin)
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user: User,
	) {
		return this.productService.update(id, updateProductDto, user);
	}

	@Delete(':id')
	@Auth(ValidRoles.admin)
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productService.remove(id);
	}
}
