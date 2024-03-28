/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { useAxios } from '@sampaiogabriel/util-axios';
import { Thing } from '@sampaiogabriel/util-ui';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function Root(props) {
  const { data, loading, error } = useAxios<Todo[]>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
