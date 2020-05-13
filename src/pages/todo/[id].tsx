import React from 'react';
import { NextPage, NextPageContext } from 'next';
import { Todo } from '@/lib/model/types';
import { getTodoApi } from '@/lib/api';
import HttpError from '@/lib/http-error';
import useSWR from 'swr';
import useRouteBack from '@/lib/hooks/useRouteBack';

interface Props {
  todo?: Todo;
  id: number;
}

const TodoDetailPage: NextPage<Props> = (props) => {
  const { todo: initialData, id } = props;
    const goBack = useRouteBack();

  const { data: todo } = useSWR(['todo', id], (__, id) => getTodoApi({ id }), {
    initialData,
  });
  return (
    <div>
      <h2>Todo {todo.id}</h2>
      <p>user: {todo.userId}</p>
      <p>content: {todo.title}</p>
      <p>completed: {`${todo.completed}`}</p>
      <button onClick={goBack}>Go back</button>
    </div>
  );
};

TodoDetailPage.getInitialProps = async (ctx: NextPageContext) => {
  const id = +ctx.query.id;
  if (!id) {
    throw new HttpError(404, 'not found');
  }
  const todo = await getTodoApi({ id });
  return {
    todo,
    id,
  };
};

export default TodoDetailPage;
