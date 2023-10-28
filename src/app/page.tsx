// App.tsx
'use client'
import React from 'react';
import { useState } from 'react';
import TaskContext from '@/components/context';
import Tasks from '@/components/main';
import SideBar from '@/components/TasksList';
import Dark from '@/components/Dark';
export interface Task {
  id: string;
  details: {
    Body: string;
    ShortDes: string;
    Title: string;
  };
}
function App() {
     const [task, setTask] = useState<Task | null>(null);

     return (

          <TaskContext.Provider value={{ task, setTask }}>
            <Dark>
               <Tasks />
               </Dark>
          </TaskContext.Provider>
     );
}

export default App;
