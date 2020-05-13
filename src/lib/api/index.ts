import { apiClient } from './client';
import { GetTodoRequest, GetTodoResponse } from './types';

export const getTodoApi = apiClient.get<GetTodoRequest, GetTodoResponse>('/todos/:id');
