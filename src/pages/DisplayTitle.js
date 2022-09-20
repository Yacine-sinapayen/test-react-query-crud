import React from 'react';
import { useQueryClient } from 'react-query';


function DisplayTitle() {
    const queryClient = useQueryClient();

  return (
    <div>
      <h1>hello world</h1>
    </div>
  )
}

export default DisplayTitle
