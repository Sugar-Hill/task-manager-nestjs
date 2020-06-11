import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid} from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { SearchByTaskDTO } from './dto/search-by-task .dto';


@Injectable()
export class TasksService {



    private tasks:Task[] = [];

    getTasksBySearchFilters(searchByTaskDTO: SearchByTaskDTO): Task[] {

        //extract the variables from searchbytaskdto
        const { searchTerm, status } = searchByTaskDTO;

        //get all the tasks and put it in a variable
        let allTasks = this.getAllTasks();

        //if the status is provided filter by status
        if(status){
            allTasks = this.tasks.filter(task => task.status === status); 
        }
        //if a searchterm is provided filter by the searchterm, check if the searchterm is included in both the description and the title
        if(searchTerm){
            allTasks = this.tasks.filter(task => task.title.includes(searchTerm) || task.description.includes(searchTerm)); 
        }
        //return the tasks
        return allTasks;
    }

    getAllTasks(): Task[]{
        return this.tasks;
    }

    getTaskById(id: string): Task {        
        return this.tasks.find(task => task.id === id);
    } 

    deleteTaskById(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);      
    }

    patchTaskStatus(id: string, status: TaskStatus): Task {
        const taskToBePatched = this.getTaskById(id);     
        taskToBePatched.status = status;
        return taskToBePatched;
    }

    createTask(createTaskDTO: CreateTaskDTO): Task {
        const { title, description } = createTaskDTO;
        const newTask: Task = {
            id: uuid(),
            title: title,
            description: description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(newTask);
        return newTask;
    }
}
