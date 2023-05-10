import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';

@Module({
	imports: [ProductModule],
	controllers: [SeedController],
	providers: [SeedService],
})
export class SeedModule {}
