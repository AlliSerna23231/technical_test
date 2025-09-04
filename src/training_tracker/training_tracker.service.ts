import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { TrainingPlan } from './entities/training-plans.entity';
import { Exercise } from './entities/exercise.entity';
import { ScheduledTraining } from './entities/scheduled-training.entity';
import { CreateTrainingPlanDto } from './dto/training-create.dto';
import { MethodAdapter } from 'src/common/methodAdapter';
import { ExerciseDto } from './dto/exercise.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTrainingPlanDto } from './dto/update-training-plan.dto';
import { ScheduleTrainingDto } from './dto/schedule-training.dto';
import { TrainingStatus } from './enum/training-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';



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

    async createTrainingPlan(createDto: CreateTrainingPlanDto) {
        const { name, description, exercises } = createDto;

        const trainingPlan = this.trainingPlanRepository.create({
            isActive: 1,
            version: 1,
            createdAt: MethodAdapter.getCurrentUnixTimestamp(),
            updatedAt: MethodAdapter.getCurrentUnixTimestamp(),
            name,
            description
        });

        await this.trainingPlanRepository.save(trainingPlan);

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
                    trainingPlan,
                });
                return this.exerciseRepository.save(exercise);
            }),
        );

        return {
            ...trainingPlan,
            exercises: exerciseEntities,
        };
    }

    async updateTrainingPlan(updateDto: UpdateTrainingPlanDto) {

        const { id, name, comment } = updateDto;

        const trainingPlan = await this.trainingPlanRepository.findOne({
            where: { id: id },
        });

        if (!trainingPlan) {
            throw new NotFoundException(`Plan con id ${id} no encontrado`);
        }

        const updateTrainingPlan = this.trainingPlanRepository.update(id, {
            name,
            comment,
            updatedAt: MethodAdapter.getCurrentUnixTimestamp()

        })

        return updateTrainingPlan;
    }

    async deleteTrainingPlan(id: string) {

        const result = await this.trainingPlanRepository.update(id, {
            isActive: 0
        })
        if (result.affected === 0) {
            throw new NotFoundException(`Plan con id ${id} no encontrado`);
        }
        return { message: 'Plan eliminado correctamente' };
    }

    async scheduleTraining(scheduleDto: ScheduleTrainingDto) {

        const { trainingPlanId, scheduledDate } = scheduleDto;

        const trainingPlan = await this.trainingPlanRepository.findOne({
            where: { id: trainingPlanId },
        });

        if (!trainingPlan) {
            throw new NotFoundException(`Plan con id ${trainingPlanId} no encontrado`);
        }

        const scheduled = this.scheduledRepository.create({
            scheduledDate,
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


    @Cron('0 * * * *', {
        name: 'check-expired-trainings',
    }) async markExpiredTrainings() {
        const now = new Date();

        const expiredTrainings = await this.scheduledRepository.find({
            where: {
                status: TrainingStatus.PENDING,
                scheduledDate: LessThan(now),
            },
        });

        if (expiredTrainings.length > 0) {
            for (const training of expiredTrainings) {
                training.status = TrainingStatus.EXPIRED;
                await this.scheduledRepository.save(training);
            }

            this.logger.log(
                `✔️ ${expiredTrainings.length} entrenamientos marcados como 'expired'.`,
            );
        } else {
            this.logger.log(`🕒 No hay entrenamientos pendientes para expirar.`);
        }
    }

    async getTrainingReport(userId: string) {
        return await this.trainingPlanRepository.find({
            where: { user: { id: userId } },
            relations: ['exercises', 'scheduledTrainings'],
        });


    }
}