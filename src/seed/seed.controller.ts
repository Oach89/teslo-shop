import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidRoles } from 'src/auth/interfaces/valide-roles.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('seed')
export class SeedController {
	constructor(private readonly seedService: SeedService) { }

	@Get()
	@Auth(ValidRoles.admin)
	executeSeed() {
		return this.seedService.runSeed();
	}
}
