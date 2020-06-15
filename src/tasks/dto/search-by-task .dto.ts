import { TaskStatus } from './../task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class SearchByTaskDTO {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    searchTerm: string;
}