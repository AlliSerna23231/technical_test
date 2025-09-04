import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TrainingTrackerModule } from './training_tracker/training_tracker.module';
import { UsersModule } from './users/users.module';
import { AppDataSource } from '../database/data-source'; 

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), 
    AuthModule,
    TrainingTrackerModule,
    UsersModule,
  ],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useValue: AppDataSource, 
    },
  ],
})
export class AppModule {}
