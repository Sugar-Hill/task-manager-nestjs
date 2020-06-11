import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void {
        return this.tasksService.deleteTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
        return this.tasksService.createTask(createTaskDTO);
    }

    @Patch('/:id/status')
    patchTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
        return this.tasksService.patchTaskStatus(id, status);
    }
}
