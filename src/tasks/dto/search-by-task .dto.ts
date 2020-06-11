import { TaskStatus } from '../task.model';

export class SearchByTaskDTO {
    status: TaskStatus;
    searchTerm: string;
}