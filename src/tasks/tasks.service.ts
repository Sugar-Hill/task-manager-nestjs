import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { SearchByTaskDTO } from './dto/search-by-task .dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';


@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository,) {}


    async getTask(searchByTask: SearchByTaskDTO, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(searchByTask, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {        
        const found = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if(!found){
            throw new NotFoundException(`Task with id of "${id}" was not found!`);
        }
        return found
    } 

    async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id of "${id}" was not found!`);
        }
    }

    async patchTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const taskToBePatched = await this.getTaskById(id, user);     
        taskToBePatched.status = status;
        await taskToBePatched.save();
        return taskToBePatched;
    }

    createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user);
    }
}
