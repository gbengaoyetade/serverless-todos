import { APIGatewayProxyEvent } from 'aws-lambda';
import * as uuid from 'uuid';
import * as todosAccess from './todosAccess';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { getUserId } from '../lambda/utils';

const s3BucketName = process.env.S3_BUCKET_NAME;

export async function createTodo(
  event: APIGatewayProxyEvent,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4();
  const userId = getUserId(event);
  const createdAt = new Date(Date.now()).toISOString();

  const todoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    ...createTodoRequest,
  };

  await todosAccess.createTodo(todoItem);

  return todoItem;
}

export const getTodos = async (event: APIGatewayProxyEvent) => {
  const userId = getUserId(event);

  return await todosAccess.getTodos(userId);
};
