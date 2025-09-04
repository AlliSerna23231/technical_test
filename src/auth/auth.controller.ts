import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';  

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post('/auth-register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return { id: user.id, email: user.email, name: user.name };
  }

  @UseGuards(AuthGuard('jwt')) 
  @Post('auth-login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso con token' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Post('auth-logout')
  @ApiOperation({ summary: 'Cerrar sesión (logout)' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  logout() {
    return { message: 'Logout exitoso. El token debe ser eliminado en el cliente.' };
  }
}
