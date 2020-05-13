import React from 'react';
import Link from 'next/link';

const Todos: React.FC = () => {
  return (
    <div>
      <div>
        <Link href="/todo/[id]" as="/todo/1">
          <a>Todo 1</a>
        </Link>
      </div>
      <div>
        <Link href="/todo/[id]" as="/todo/2">
          <a>Todo 2</a>
        </Link>
      </div>
      <div>
        <Link href="/todo/[id]" as="/todo/3">
          <a>Todo 3</a>
        </Link>
      </div>
    </div>
  );
};

export default Todos;
