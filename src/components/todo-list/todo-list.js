import React from 'react';
import {style} from './style'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { TextField,Divider,Button } from "@mui/material";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useState } from 'react'
import { useMutation, useQueryClient } from "react-query"
import { updateTodo } from "../../api/todosApi"

const TodoList = (props) => {
  const { todos, onDelete, onChangeLabel } = props;
  const [open, setOpen] = useState(false);
  const [changedLabel,setLabel] = useState('');
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation(updateTodo, {      
        onSuccess: () => {            
            queryClient.invalidateQueries("todos")
        }    
    })  
  
  const handleOpen = () => {
    setOpen(true);   
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange=(e)=>{
    setLabel(e.target.value);
    //onChangeLabel(e.target.value);
  }
  
  return (   
    <List dense sx={{ width: '100%', maxHeight: 150,maxWidth: 700, bgcolor: 'background.paper'}}>
          {todos.map((todo) => {
              const isImportant = todo.important ? '#DDA0DD' : 'none';
              const isDone= todo.done ? 'line-through' : 'none';
              const labelId = `checkbox-list-secondary-label-${todo.id}`;
            return (
              <>
            <ListItem sx={{fontWeight:800, height: 50, bgcolor:isImportant , textDecoration: isDone} } 
                key={todo.id}           
                secondaryAction={  
                  <>   
                  <IconButton 
                      aria-label="done"
                      size='large'
                      onClick={() =>updateTodoMutation.mutate({ ...todo, done: !todo.done })}>                 
                    <DoneIcon color="primary"/>               
                  </IconButton>                       
                  <IconButton 
                      aria-label="important"
                      size='large'
                      onClick={() =>updateTodoMutation.mutate({ ...todo, important: !todo.important })}
                    >                                                        
                    <PriorityHighIcon color="secondary"/>               
                  </IconButton>
                  <IconButton 
                      aria-label="delete"
                      size='large'
                      onClick={()=>onDelete(todo.id)}>                 
                    <DeleteIcon color="error"/>               
                  </IconButton>               
                  </>
                }
                disablePadding
              >
                <ListItemButton
                  onClick={handleOpen}>                       
                  <ListItemText id={labelId} primary={todo.title}>
                  </ListItemText>                                
                </ListItemButton>                            
                </ListItem>            
                <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ ...style }}>              
                  <Divider sx={{color:'#191970 ', fontSize: "20px"}} textAlign="center">
                  Информация о задаче:
                  </Divider>
                  <Typography sx={{color:'#4169E1'}} variant="h6" component="h6">
                      Дата создания: { todo.created.toLocaleString()}
                  </Typography> 
                  <Typography sx={{color:'#000080'}} variant="h6" component="h6">            
                      Статус: { todo.done ? 'Сделано' : 'Не сделано'}
                  </Typography> 
                  <Typography sx={{color:'#FF0000'}} variant="h6" component="h6">      
                      Важность: { todo.important ? 'Важно' : 'Не важно'}  
                  </Typography> 
                  <br/>
                  <Typography sx={{color:'#0000CD'}} variant="h5" component="h2">
                      Задача:                
                  </Typography>
                  <TextField      
                  value={changedLabel}
                  onChange={onChange}
                  variant="outlined"                    
                  type='text' 
                  sx={{mb:'2rem', width: '22rem'}}
                  />           
                  <Button 
                  variant="outlined"
                  onClick={handleClose}>
                  Закрыть
                  </Button>
              </Box>            
            </Modal>
                </>
                )})}
            </List>
          );
  };

export default TodoList;