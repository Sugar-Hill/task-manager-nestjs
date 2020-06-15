import { Entity, EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { SearchByTaskDTO } from './dto/search-by-task .dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(searchTasksDTO: SearchByTaskDTO): Promise<Task[]> {
        const { status, searchTerm } = searchTasksDTO;
        const query = this.createQueryBuilder('task');

        if(status) {
            query.andWhere('task.status = :status', { status });
        }

        if(searchTerm) {
            query.andWhere('(task.title LIKE :searchTerm OR task.description Like :searchTerm)', { searchTerm: `%${searchTerm}` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const { title, description } = createTaskDTO;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
}