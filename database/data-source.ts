import { Exercise } from '../src/training_tracker/entities/exercise.entity';
import { ScheduledTraining } from '../src/training_tracker/entities/scheduled-training.entity';
import { TrainingPlan } from '../src/training_tracker/entities/training-plans.entity';
import { User } from '../src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, TrainingPlan, Exercise, ScheduledTraining],
  migrations: ['database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
