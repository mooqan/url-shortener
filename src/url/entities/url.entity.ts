import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalUrl: string;

    @Column({ unique: true })
    shortUrl: string;

    @Column()
    title: string;

    @ManyToOne(() => User, user => user.urls)
    user: User;
}