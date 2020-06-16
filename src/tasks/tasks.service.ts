import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { SearchByTaskDTO } from './dto/search-by-task .dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';


@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository,) {}


    async getTask(searchByTask: SearchByTaskDTO): Promise<Task[]> {
        return this.taskRepository.getTasks(searchByTask);
    }

    async getTaskById(id: number): Promise<Task> {        
        const found = await this.taskRepository.findOne(id);

        if(!found){
            throw new NotFoundException(`Task with id of "${id}" was not found!`);
        }
        return found
    } 

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id of "${id}" was not found!`);
        }
    }

    async patchTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const taskToBePatched = await this.getTaskById(id);     
        taskToBePatched.status = status;
        await taskToBePatched.save();
        return taskToBePatched;
    }

    createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO);
    }
}
