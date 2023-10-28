import React, { useState, useEffect, useContext } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Drawer, Typography, Button } from '@mui/material';
import { MdMenu } from 'react-icons/md';
import TaskContext from './context';
import { Task } from '../app/page';


const SideBar: React.FC = () => {

  const [open, setOpen] = useState(false);
  const { setTask } = useContext(TaskContext);
  const [data, setData] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      let res = await fetch("http://127.0.0.1:1337", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Action: "GET"
        }),
      });
      const rawData = await res.json();

      const result: Task[] = rawData.map(([id, details]: [string, { Body: string; ShortDes: string; Title: string; }]) => ({ id, details }));

      setData(result);
    } catch (error) {
      console.error("Błąd:", error);
    }
  };


  const RemoveTask = async (ID: string) => {
    try {
      let res = await fetch("http://127.0.0.1:1337", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Action: "Remove",
          ID,
        }),
      });
      const rawData = await res.json();

      const result: Task[] = rawData.map(([id, details]: [string, { Body: string; ShortDes: string; Title: string; }]) => ({ id, details }));

      setData(result);
     
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleDrawer = (anchor: string, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setOpen(open);
  };

  return (
    <Box>
      <IconButton onClick={toggleDrawer('right', true)}>
        <MdMenu size={36} />
      </IconButton>
      <Drawer anchor={'right'} open={open} onClose={toggleDrawer('right', false)}>
        <Box
          role="presentation"
          onClick={toggleDrawer('right', false)}
          onKeyDown={toggleDrawer('right', false)}
        >
          <List>
            {data.map((task: Task) => (
              <ListItem button key={task.id} onClick={() => setTask(task)}>
                <ListItemText primary={task.details.Title} />

                <Button
                  onClick={() => RemoveTask(task.id)}
                >
                  Remove
                </Button>

              </ListItem>

            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};


export default SideBar;
