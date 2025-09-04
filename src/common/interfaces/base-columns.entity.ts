import { Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

export abstract class BaseColumns  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric' })
  isActive: number; 

  @VersionColumn()
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint', nullable: true })
  updatedAt: number;

}
