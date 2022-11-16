import { useQuery, useMutation, useQueryClient } from "react-query"
import { getTodos, addTodo, deleteTodo } from "./api/todosApi"
import { useState } from 'react'
import Header from './components/header/header';
import Basket from './components/basket/basket';
import Snack from './components/snack/snack'
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TextField } from "@mui/material";
import { Alert, AlertTitle,CircularProgress } from '@mui/material';
import { Container } from '@mui/material';
import TodoList from './components/todo-list/todo-list';
import { useForm } from 'react-hook-form';

const App = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [order, setOrder] = useState([]);
    const [isSnackOpen, setSnackOpen] = useState('');
    const [search, setSearch] = useState('');    
    const queryClient = useQueryClient();

    const {
        isLoading,
        isError,
        error,
        data: todos
    } = useQuery('todos', getTodos, {
        select: data => data.sort((a, b) => b.id - a.id)
    })

    const {
        register, 
        formState:{
        errors, isValid
        },
        handleSubmit,
        reset
        } = useForm({
        mode: "all"
        }
        );   
    
    const addTodoMutation = useMutation(addTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todos")
        }
    })   
    
    const deleteTodoMutation = useMutation(deleteTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todos")
        }
    })

    const onSubmit = (data) => {
        if(data.label.trim() === '') return;
        addTodoMutation.mutate({ title: data.label.trim(), important: false, done: false, created: new Date().toJSON() }) 
        reset();
        setSnackOpen('new');
    }    
  
    const onDelete = (id) => {
        deleteTodoMutation.mutate({id});           
        setSnackOpen('delete');
        addToOrder(id);                
    };
    
    const onChangeLabel=(id,changedLabel)=>{
        // const idx = todos.findIndex((todo) => todo.id === id);
        // const currentTodo = todos.filter((item)=>item.id===id);
        // currentTodo[0].label = changedLabel;
        // const changedTodos = [
        //     ...todos.slice(0, idx),
        //     ...currentTodo,
        //     ...todos.slice(idx + 1)
        //  ];
        // setTodos(changedTodos);
    }

    const handleChange = (todos,search) => {
        if (search.length === 0) {
        return todos;
        }
        return todos.filter((item) =>{
                return item.title.toLowerCase().includes(search.toLowerCase());
        });  
    };  
    
    const onChange=(term)=>{
        setSearch(term);      
    }
    
    const addToOrder = (basket) => {
        debugger;
        let quantity = 1;
        const idx = todos.findIndex((todo) => todo.id === basket);
        const indexInOrder = order.findIndex(
            (item) => item.id === basket.id
        );

        if (indexInOrder > -1) {
            quantity = order[indexInOrder].quantity + 1;

            setOrder(order.map((item) => {
                    if (item.id !== basket.id) return item;

                    return {
                        id: item.id,
                        title: item.title,
                        important: item.important,
                        done: item.done,
                        created: item.created,
                        quantity,
                    };
                }),
            );
        } else {
            setOrder([
                    ...order,
                    {
                        id: todos[idx].id,
                        title: todos[idx].title,
                        important: todos[idx].important,
                        done: todos[idx].done,
                        created: todos[idx].created,
                        quantity,
                    },
                ],
            );
        }    
    };

    const removeFromOrder = (basketItem) => {   
        const restoreTodo = order.filter((item)=>item.id===basketItem); 
        addTodoMutation.mutate({ title: restoreTodo[0].title, 
                                important: restoreTodo[0].important,
                                done: restoreTodo[0].done, 
                                created: restoreTodo[0].created });
        setOrder(order.filter((item) => item.id !== basketItem));
        setSnackOpen('restore');
    };      
    
    const visibleTodos = handleChange(todos,search);

    const newSection = (
          <>                                   
            <form
            onSubmit={handleSubmit(onSubmit)}>
            <TextField      
            label="Новая задача"
            variant="standard"                    
            type="text"
            id="new-todo"
            sx={{mb:'1.5rem', width: '25rem'}}
            {...register('label',
            {required:"Невозможно добавить пустой запись(Пожалуйста,заполните поле)",
            minLength: {
                value: 3,
                message: 'Минимум 3 символа'
            },
             maxLength:{
                value: 32,
                message:'Запись должна содержать максимум 32 символа'
             }
             })}
             />
            <IconButton sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" disabled={!isValid}>
            <CheckCircleIcon color="primary" fontSize="large"/>                 
            </IconButton>             
            </form>
            {errors?.label && <>
                      <Alert severity="error">
                      <AlertTitle>{errors?.label.message || "Error!"}</AlertTitle>         
                      </Alert>   
                      </>}                
            </>
        );

    let content
    if (isLoading) {
        content = <CircularProgress color="secondary" />
    } else if (isError) {
        content = <Alert severity="error">
        {error.message}
       </Alert> 
    } else {
        content = (  
                    <TodoList
                        todos ={ visibleTodos }                          
                        onDelete={onDelete} 
                        onChangeLabel={onChangeLabel}
                    />   
                 )        
    }

    return (
        <main>     
            <Header 
                handleCart={()=>setCartOpen(true)}
                orderLen={order.length}
                onChange={onChange}
            />
            <Container
                sx={{mt: '1rem'}}
            >      
            {newSection}
            {content}
            </Container>
            <Basket 
              order={order}
              removeFromOrder={removeFromOrder}
              cartOpen={isCartOpen}
              closeCart={()=>setCartOpen()}
            />
            <Snack 
            isOpen={isSnackOpen}
            handleClose={()=> setSnackOpen(false)}/>
        </main>
    )
}
export default App