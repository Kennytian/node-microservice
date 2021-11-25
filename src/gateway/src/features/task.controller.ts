import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Authorization } from '../decorators/authorization.decorator';
import { Permission } from '../decorators/permission.decorator';
import { IAuthorizedRequest } from '../interfaces/common/authorized-request.interface';
import { CreateTaskResponseDto } from '../interfaces/task/dto/create-task-response.dto';
import { CreateTaskDto } from '../interfaces/task/dto/create-task.dto';
import { DeleteTaskResponseDto } from '../interfaces/task/dto/delete-task-response.dto';
import { GetTasksResponseDto } from '../interfaces/task/dto/get-tasks-response.dto';
import { TaskIdDto } from '../interfaces/task/dto/task-id.dto';
import { UpdateTaskResponseDto } from '../interfaces/task/dto/update-task-response.dto';
import { UpdateTaskDto } from '../interfaces/task/dto/update-task.dto';
import { IServiceTaskCreateResponse } from '../interfaces/task/service-task-create-response.interface';
import { IServiceTaskDeleteResponse } from '../interfaces/task/service-task-delete-response.interface';
import { IServiceTaskUpdateByIdResponse } from '../interfaces/task/service-task-update-by-id-response.interface';
import {
  TASK_SERVICE,
  task_create,
  task_delete_by_id,
  task_search_by_user_id,
  task_update_by_id
} from "@project/constants";

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(
    @Inject(TASK_SERVICE) private readonly taskServiceClient: ClientProxy,
  ) {}

  @Get()
  @Authorization(true)
  @Permission(task_search_by_user_id)
  @ApiOkResponse({
    type: GetTasksResponseDto,
    description: 'List of tasks for signed in user',
  })
  public async getTasks(
    @Req() request: IAuthorizedRequest,
  ): Promise<GetTasksResponseDto> {
    const userInfo = request.user;

    const tasksResponse: Record<string, any> = await firstValueFrom(
      this.taskServiceClient.send(task_search_by_user_id, userInfo.id),
    );

    return {
      message: tasksResponse.message,
      data: { tasks: tasksResponse.tasks },
      errors: null,
    };
  }

  @Post()
  @Authorization(true)
  @Permission(task_create)
  @ApiCreatedResponse({ type: CreateTaskResponseDto })
  public async createTask(
    @Req() request: IAuthorizedRequest,
    @Body() taskRequest: CreateTaskDto,
  ): Promise<CreateTaskResponseDto> {
    const userInfo = request.user;
    const createTaskResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send(task_create, {
        ...taskRequest,
        user_id: userInfo.id,
      }),
    );
    if (createTaskResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createTaskResponse.message,
          data: null,
          errors: createTaskResponse.errors,
        },
        createTaskResponse.status,
      );
    }
    return {
      message: createTaskResponse.message,
      data: { task: createTaskResponse.task },
      errors: null,
    };
  }

  @Delete(':id')
  @Authorization(true)
  @Permission(task_delete_by_id)
  @ApiOkResponse({ type: DeleteTaskResponseDto })
  public async deleteTask(
    @Req() request: IAuthorizedRequest,
    @Param() params: TaskIdDto,
  ): Promise<DeleteTaskResponseDto> {
    const userInfo = request.user;
    const deleteTaskResponse: IServiceTaskDeleteResponse = await firstValueFrom(
      this.taskServiceClient.send(task_delete_by_id, {
        id: params.id,
        userId: userInfo.id,
      }),
    );

    if (deleteTaskResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteTaskResponse.message,
          errors: deleteTaskResponse.errors,
          data: null,
        },
        deleteTaskResponse.status,
      );
    }

    return { message: deleteTaskResponse.message, data: null, errors: null };
  }

  @Put(':id')
  @Authorization(true)
  @Permission(task_update_by_id)
  @ApiOkResponse({ type: UpdateTaskResponseDto })
  public async updateTask(
    @Req() request: IAuthorizedRequest,
    @Param() params: TaskIdDto,
    @Body() taskRequest: UpdateTaskDto,
  ): Promise<UpdateTaskResponseDto> {
    const userInfo = request.user;

    const updateTaskResponse: IServiceTaskUpdateByIdResponse = await firstValueFrom(
      this.taskServiceClient.send(task_update_by_id, {
        id: params.id,
        userId: userInfo.id,
        task: taskRequest,
      }),
    );

    if (updateTaskResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateTaskResponse.message,
          errors: updateTaskResponse.errors,
          data: null,
        },
        updateTaskResponse.status,
      );
    }

    return {
      message: updateTaskResponse.message,
      data: {
        task: updateTaskResponse.task,
      },
      errors: null,
    };
  }
}
