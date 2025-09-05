import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../users/entities/user.entity'
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MethodAdapter } from 'src/common/methodAdapter';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const exists = await this.usersRepository.findOne({ where: { email } });
    if (exists) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      isActive: 1,
      version: 1,
      createdAt: MethodAdapter.getCurrentUnixTimestamp(),
      updatedAt: MethodAdapter.getCurrentUnixTimestamp(),
      email,
      password: hashedPassword,
      name,
    });

    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
