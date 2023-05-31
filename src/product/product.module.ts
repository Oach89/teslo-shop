import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService, TypeOrmModule],
})
export class ProductModule { }
