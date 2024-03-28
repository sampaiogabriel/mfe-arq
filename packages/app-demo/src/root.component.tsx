/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { useEffect, useState } from 'react';

import useTodoServico from './services';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function Root(props) {
  const [todoList, setTodoList] = useState([]);
  const api = useTodoServico();

  async function getTodos() {
    const response = await api.get('');
    setTodoList(response);
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todoList?.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
