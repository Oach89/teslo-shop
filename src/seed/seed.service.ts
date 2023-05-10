import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
	constructor(private readonly productService: ProductService) {}
	async runSeed() {
		await this.insertNewProducts();
		return 'seed';
	}

	private async insertNewProducts() {
		await this.productService.deleteAllProducts();

		const products = initialData.products;

		const insertPromise = [];
		products.forEach((product) => {
			insertPromise.push(this.productService.create(product));
		});
		const results = await Promise.all(insertPromise);
		return true;
	}
}
