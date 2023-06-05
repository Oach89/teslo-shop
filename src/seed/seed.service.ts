import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
	constructor(
		private readonly productService: ProductService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) { }
	async runSeed() {
		await this.deleteTables();
		const userAdmin = await this.insertUsers();
		await this.insertNewProducts(userAdmin);
		return 'seed';
	}

	private async deleteTables() {
		await this.productService.deleteAllProducts();
		const querBuilder = this.userRepository.createQueryBuilder();
		await querBuilder.delete().where({}).execute();
	}

	private async insertUsers() {
		const seedUser = initialData.users;
		const users: User[] = [];
		seedUser.forEach((user) => {
			users.push(this.userRepository.create(user));
		});
		const dbUser = await this.userRepository.save(seedUser);
		return dbUser[0];
	}

	private async insertNewProducts(user: User) {
		await this.productService.deleteAllProducts();

		const products = initialData.products;

		const insertPromise = [];
		products.forEach((product) => {
			insertPromise.push(this.productService.create(product, user));
		});
		const results = await Promise.all(insertPromise);
		return true;
	}
}
