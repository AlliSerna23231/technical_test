import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { TrainingPlan } from './entities/training-plans.entity';
import { Exercise } from './entities/exercise.entity';
import { ScheduledTraining } from './entities/scheduled-training.entity';
import { CreateTrainingPlanDto } from './dto/training-create.dto';
import { MethodAdapter } from '../common/methodAdapter';
import { ExerciseDto } from './dto/exercise.dto';
import { UpdateTrainingPlanDto } from './dto/update-training-plan.dto';
import { ScheduleTrainingDto } from './dto/schedule-training.dto';
import { TrainingStatus } from './enum/training-status.enum';
import { v4 as uuid } from 'uuid';



@Injectable()
export class TrainingTrackerService {
    logger: any;
    constructor(
        @InjectRepository(TrainingPlan)
        private readonly trainingPlanRepository: Repository<TrainingPlan>,
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
        @InjectRepository(ScheduledTraining)
        private readonly scheduledRepository: Repository<ScheduledTraining>,
    ) { }


    async createExercise(createExersiceDto: ExerciseDto) {
        const { name, repetitions, sets, weight } = createExersiceDto;

        const exercise = this.exerciseRepository.create({
            id: uuid(),
            isActive: 1,
            version: 1,
            createdAt: MethodAdapter.getCurrentUnixTimestamp(),
            updatedAt: MethodAdapter.getCurrentUnixTimestamp(),
            name,
            repetitions,
            sets,
            weight,
        });

        return this.exerciseRepository.save(exercise);
    }

    async createTrainingPlan(createDto: CreateTrainingPlanDto, user) {
        const { name, description, exercises } = createDto;

        const trainingPlan = this.trainingPlanRepository.create({
            isActive: 1,
            version: 1,
            createdAt: MethodAdapter.getCurrentUnixTimestamp(),
            updatedAt: MethodAdapter.getCurrentUnixTimestamp(),
            name,
            description,
            user,
        });
        const savedTrainingPlan = await this.trainingPlanRepository.save(trainingPlan);

        const exerciseEntities = await Promise.all(
            exercises.map(async (ex) => {
                const exercise = this.exerciseRepository.create({
                    isActive: 1,
                    version: 1,
                    createdAt: MethodAdapter.getCurrentUnixTimestamp(),
                    updatedAt: MethodAdapter.getCurrentUnixTimestamp(),
                    name: ex.name,
                    repetitions: ex.repetitions,
                    sets: ex.sets,
                    weight: ex.weight,
                    trainingPlan: savedTrainingPlan,
                });
                return this.exerciseRepository.save(exercise);
            })
        );

        return {
            id: savedTrainingPlan.id,
            name: savedTrainingPlan.name,
            description: savedTrainingPlan.description,
            isActive: savedTrainingPlan.isActive,
            version: savedTrainingPlan.version,
            createdAt: savedTrainingPlan.createdAt,
            updatedAt: savedTrainingPlan.updatedAt,
            user: {
                id: user.id,
                name: user.name,
            },
            exercises: exerciseEntities.map(ex => ({
                id: ex.id,
                name: ex.name,
                repetitions: ex.repetitions,
                sets: ex.sets,
                weight: ex.weight,
                isActive: ex.isActive,
                version: ex.version,
                createdAt: ex.createdAt,
                updatedAt: ex.updatedAt,
            })),
        };
    }

    async updateTrainingPlan(id: string, updateDto: UpdateTrainingPlanDto) {
        const { name, comment, exercises } = updateDto;

        const trainingPlan = await this.trainingPlanRepository.findOne({
            where: { id },
            relations: ['exercises'],
        });

        if (!trainingPlan) {
            throw new NotFoundException(`Plan con id ${id} no encontrado`);
        }

        // Actualiza los datos básicos del plan de entrenamiento
        trainingPlan.name = name ?? trainingPlan.name;
        trainingPlan.comment = comment ?? trainingPlan.comment;
        trainingPlan.updatedAt = MethodAdapter.getCurrentUnixTimestamp();

        await this.trainingPlanRepository.save(trainingPlan);

        if (exercises && exercises.length > 0) {
            await Promise.all(
                exercises.map(async (ex) => {
                    const exercise = trainingPlan.exercises.find((e) => e.id === ex.id);
                    if (exercise) {
                        exercise.name = ex.name ?? exercise.name;
                        exercise.repetitions = ex.repetitions ?? exercise.repetitions;
                        exercise.sets = ex.sets ?? exercise.sets;
                        exercise.weight = ex.weight ?? exercise.weight;
                        exercise.updatedAt = MethodAdapter.getCurrentUnixTimestamp();

                        await this.exerciseRepository.save(exercise);
                    }
                }),
            );
        }

        return {
            id: trainingPlan.id,
            name: trainingPlan.name,
            comment: trainingPlan.comment,
            exercises: trainingPlan.exercises.map((e) => ({
                id: e.id,
                name: e.name,
                repetitions: e.repetitions,
                sets: e.sets,
                weight: e.weight,
            })),
        };
    }



    async deleteTrainingPlan(id: string) {
        const trainingPlan = await this.trainingPlanRepository.findOne({
            where: { id: id }
        })

        if (!trainingPlan) {
            throw new NotFoundException(`Plan con id ${id} no encontrado`);
        }

        await this.trainingPlanRepository.delete(id)

        return { message: 'Plan eliminado correctamente' };
    }


    // Obtener entrenamientos pendientes
    async getPendingTrainings(): Promise<ScheduledTraining[]> {
        return this.scheduledRepository.find({
            where: {  status: TrainingStatus.PENDING  },
        });
    }

    // Actualizar el estado de un entrenamiento
    async updateTrainingStatus(id: string, status: TrainingStatus): Promise<void> {
        await this.scheduledRepository.update(id, { status });
    }


    async scheduleTraining(id: string, scheduleDto: ScheduleTrainingDto) {

        const { scheduledDate, scheduledTime } = scheduleDto;

        const trainingPlan = await this.trainingPlanRepository.findOne({
            where: { id: id },
        });

        if (!trainingPlan) {
            throw new NotFoundException(`Plan con id ${id} no encontrado`);
        }

        const scheduled = this.scheduledRepository.create({
            isActive: 1,
            version: 1,
            createdAt: MethodAdapter.getCurrentUnixTimestamp(),
            updatedAt: MethodAdapter.getCurrentUnixTimestamp(),
            scheduledDate: MethodAdapter.getScheduledDate(scheduledDate),
            scheduledTime: MethodAdapter.getScheduledTime(),
            trainingPlan,
        });

        return await this.scheduledRepository.save(scheduled);
    }




    async getTrainingList(status?: TrainingStatus) {
        return await this.scheduledRepository.find({
            relations: ['trainingPlan'],
            order: { scheduledDate: 'ASC' },
            where: status ? { status } : {
                status: In([TrainingStatus.PENDING, TrainingStatus.ACTIVE]),
            },
        });
    }

    async getTrainingReport(userId: string) {
        return await this.trainingPlanRepository.find({
            where: { user: { id: userId } },
            relations: ['exercises', 'scheduledTrainings'],
        });


    }
}