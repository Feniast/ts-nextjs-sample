import React from 'react';
import useRouteBack from '@/lib/hooks/useRouteBack';

const Hello: React.FC = (props) => {
  const goBack = useRouteBack();
  return (
    <div>
      <h2>Hello World</h2>
      <button onClick={goBack}>Go back</button>
    </div>
  );
};

export default Hello;
