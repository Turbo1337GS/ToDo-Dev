// App.tsx lub context.tsx
import React from 'react';

interface Task {
     id: string;
     details: {
          Body: string;
          ShortDes: string;
          Title: string;
     };
}

const TaskContext = React.createContext<{
     task: Task | null;
     setTask: React.Dispatch<React.SetStateAction<Task | null>>;
}>({ task: null, setTask: () => {} });

export default TaskContext;
