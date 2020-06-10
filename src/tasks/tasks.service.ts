import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid} from 'uuid';


@Injectable()
export class TasksService {
    private tasks:Task[] = [];

    getAllTasks(): Task[]{
        return this.tasks;
    }

    //add a create task method that takes the title and description as input from the user and generates the uuid
    createTask(title: string, description: string): Task {
        const newTask: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(newTask);
        return newTask;
    }
}
