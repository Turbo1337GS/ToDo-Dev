import React, { useContext, useEffect, useState } from "react";
import { Typography, Box, TextField, Checkbox, Button, FormControl, Grid, Paper, useMediaQuery, useTheme } from "@mui/material";
import { Task } from "@/app/page";
import SideBar from "./TasksList";
import TaskContext from "./context";
import CodeBlock from "./Markdown";

export default function Tasks() {
  const [Title, setTitle] = useState("");
  const [ShortDes, setShortDes] = useState("");
  const [Body, setBody] = useState("");
  const { task } = useContext(TaskContext);
  const [markdown, setMarkdown] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const newTask = async () => {
    try {
      let res = await fetch("http://127.0.0.1:1337", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title,
          ShortDes,
          Body,
        }),
      });

      if (res.status === 200) {
        window.location.reload()
        setTitle("");
        setShortDes("");
        setBody("");
      } else {
        console.error("Failed to create task");
        return;
      }

    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.details.Title);
      setShortDes(task.details.ShortDes);
      setBody(task.details.Body);
    }
  }, [task]);

  return (
    <main>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <SideBar />
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 4, my: 2 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <img
                src="https://main.gigasoft.com.pl/logo.png"
                height="10%"
                width="10%"
                alt="Logo"
              />
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                autoComplete="off"
                autoCorrect="off"
                label="Title"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                autoComplete="off"
                autoCorrect="off"
                label="Short description"
                value={ShortDes}
                onChange={(e) => setShortDes(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                autoComplete="off"
                autoCorrect="off"
                label="Body"
                multiline
                value={Body}
                onChange={(e) => setBody(e.target.value)}
                sx={{
                  '& .MuiInputBase-multiline': {
                    overflowY: 'auto',
                  },
                  '& .MuiInputBase-inputMultiline': {
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap',
                  },
                }}
              />
            </FormControl>
            <Box sx={{ textAlign: "center" }}>
              <Button color="primary" variant="contained" sx={{ marginTop: 2 }} onClick={newTask}>
                Submit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
              <Checkbox color="primary" onChange={() => setMarkdown(!markdown)} />
              <Typography variant="body1">Preview Markdown</Typography>
            </Box>
            {markdown ? (
              <CodeBlock text={Body} />
            ) : <></>}
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
}
