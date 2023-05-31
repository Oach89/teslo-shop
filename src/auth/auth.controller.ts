import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	Headers,
	SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valide-roles.interface';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	create(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute(
		// @Req() request: Express.Request
		@GetUser() user: User,
		@GetUser('email') userEmail: User,
		@RawHeaders() rawHeaders: string[],
		@Headers() headers: IncomingHttpHeaders,
	) {
		console.log({ user });
		return {
			ok: true,
			menssage: 'Private',
			user,
			userEmail,
			rawHeaders,
			headers,
		};
	}

	@Get('private-role')
	// @SetMetadata('roles', ['admin', 'super-admin'])
	@RoleProtected(ValidRoles.admin)
	@UseGuards(AuthGuard(), UserRoleGuard)
	privateRouteRole(@GetUser() user: User) {
		return {
			ok: true,
			menssage: 'Role',
			user,
		};
	}

	@Get('private-role-custom')
	// @RoleProtected(ValidRoles.admin)
	// @UseGuards(AuthGuard(), UserRoleGuard)
	@Auth(ValidRoles.admin)
	privateRouteRoleCustom(@GetUser() user: User) {
		return {
			ok: true,
			menssage: 'Role',
			user,
		};
	}
}
