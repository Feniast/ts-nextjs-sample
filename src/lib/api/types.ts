import { Todo } from '../model/types';

export interface GetTodoRequest {
  id: number
};

export interface GetTodoResponse extends Todo {};
