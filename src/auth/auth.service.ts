import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtServices: JwtService,
	) {}
	async create(createUserDto: CreateUserDto) {
		try {
			const { password, ...userData } = createUserDto;
			const newUser = this.userRepository.create({
				...userData,
				password: bcrypt.hashSync(password, 10),
			});
			await this.userRepository.save(newUser);
			delete newUser.password;
			return {
				...newUser,
				token: this.getJwtToken({ id: newUser.id }),
			};
			// Todo: retorno de JWT de acceso
		} catch (error) {
			this.handleDBErrors(error);
		}
	}

	async login(loginUserDto: LoginUserDto) {
		try {
			const { email, password } = loginUserDto;
			const user = await this.userRepository.findOne({
				where: {
					email,
				},
				select: {
					email: true,
					password: true,
					id: true,
				},
			});
			if (!user)
				throw new UnauthorizedException('Credentials are not valid(email)');
			if (!bcrypt.compareSync(password, user.password))
				throw new UnauthorizedException('Credentials are not valid(password)');
			const idUser = user.id;
			delete user.id;
			return {
				...user,
				token: this.getJwtToken({ id: idUser }),
			};
		} catch (error) {
			this.handleDBErrors(error);
		}
	}

	private getJwtToken(payload: JwtPayload) {
		const token = this.jwtServices.sign(payload);
		return token;
	}

	private handleDBErrors(error: any): never {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail);
		}
		console.log(error);
		throw new InternalServerErrorException('Please check server logs');
	}
}
