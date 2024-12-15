import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Método para registrar un nuevo usuario
  async register(registerAuthDto: RegisterAuthDto) {
    const { name, mail, password } = registerAuthDto;
  
    // Verificar si el correo ya está registrado
    const existingUser = await this.usersService.findByEmail(mail);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
  
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Crear un nuevo usuario
    const newUser: CreateUserDto = {
      name,
      mail,
      password: hashedPassword,
    };
  
    const user = await this.usersService.create(newUser);
  
    // Generar token JWT
    const payload = { email: user.mail, id: user.id };
    const token = this.jwtService.sign(payload);
  
    // Excluir la contraseña de la respuesta
    const { password: _, ...userData } = user;
  
    return { user: userData, token };
  }
  

  // Método de login
  async login(loginAuthDto: LoginAuthDto) {
    const { mail, password } = loginAuthDto;

    const user = await this.usersService.findByEmail(mail);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { email: user.mail, id: user.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}