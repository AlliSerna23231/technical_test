import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TrainingTrackerService } from './training_tracker.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTrainingPlanDto } from './dto/training-create.dto';
import { UpdateTrainingPlanDto } from './dto/update-training-plan.dto';
import { ScheduleTrainingDto } from './dto/schedule-training.dto';
import { TrainingStatus } from './enum/training-status.enum';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('training-tracker')
@Controller('training-tracker')
export class TrainingTrackerController {
  constructor(private readonly trainingTrackerService: TrainingTrackerService) { }


  @UseGuards(AuthGuard('jwt'))  
  @Post('/training-create')
  @ApiOperation({ summary: 'Crear un nuevo plan de entrenamiento' })
  @ApiResponse({ status: 201, description: 'plan de entrenamiento creado correctamente' })
  async trainingCreate(@Body() createDto: CreateTrainingPlanDto) {
    return this.trainingTrackerService.createTrainingPlan(createDto);
  }

  @UseGuards(AuthGuard('jwt'))  
  @Put('/training-update')
  @ApiOperation({ summary: 'Actualizar un plan existente y agregar comentarios.' })
  @ApiResponse({ status: 201, description: 'plan actualizado correctamente' })
  async trainingUpdate(@Body() updateDto: UpdateTrainingPlanDto) {
    return this.trainingTrackerService.updateTrainingPlan(updateDto);
  }


  @UseGuards(AuthGuard('jwt')) 
  @Delete('/training-delete')
  @ApiOperation({ summary: 'Eliminar un plan de entrenamiento' })
  @ApiResponse({ status: 201, description: 'plan eliminado correctamente' })
  @ApiQuery({
    name: 'id',
    required: false
  })
  async trainingDelete(@Query('id') id: string) {
    return this.trainingTrackerService.deleteTrainingPlan(id);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Post('/training-schedule')
  @ApiOperation({ summary: 'Programar entrenamientos con fecha y hora' })
  @ApiResponse({ status: 201, description: 'programación realizada correctamente' })
  async trainingSchedule(@Body() scheduleDto: ScheduleTrainingDto) {
    return this.trainingTrackerService.scheduleTraining(scheduleDto);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('/training-list')
  @ApiOperation({ summary: 'Listar entrenamientos activos o pendientes, ordenados por fecha' })
  @ApiResponse({ status: 201, description: 'Listado de entrenamientos' })
  @ApiQuery({
    name: 'status',
    required: false
  })
  async trainingList(@Query('status') status: TrainingStatus) {
    return this.trainingTrackerService.getTrainingList(status);
  }

  @UseGuards(AuthGuard('jwt'))  
  @Get('/training-report')
  @ApiOperation({ summary: 'Generar informes de progreso y entrenamientos anteriores.' })
  @ApiResponse({ status: 201, description: 'Informes de progreso y entrenamientos anteriores' })
  async trainingReport(@Query('userId') userId: string) {
    return this.trainingTrackerService.getTrainingReport(userId);
  }
}
