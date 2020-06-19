import { Entity, EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { SearchByTaskDTO } from './dto/search-by-task .dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(searchTasksDTO: SearchByTaskDTO, user: User): Promise<Task[]> {
        const { status, searchTerm } = searchTasksDTO;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if(status) {
            query.andWhere('task.status = :status', { status });
        }

        if(searchTerm) {
            query.andWhere('(task.title LIKE :searchTerm OR task.description Like :searchTerm)', { searchTerm: `%${searchTerm}` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        const { title, description } = createTaskDTO;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        
        delete task.user;
        
        return task;
    }
}