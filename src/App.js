import { useQuery, useMutation, useQueryClient } from "react-query"
import { getTodos, addTodo, deleteTodo } from "./api/todosApi"
import { useState } from 'react'
import Header from './components/header/header';
import Basket from './components/basket/basket';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TextField } from "@mui/material";
import { Alert, AlertTitle,CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Container } from '@mui/material';
import TodoList from './components/todo-list/todo-list';
import { useForm } from 'react-hook-form';

const App = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [order, setOrder] = useState([]);
    const [search, setSearch] = useState('');  
    const { enqueueSnackbar } = useSnackbar();  
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
        enqueueSnackbar('Создана новая задача!',{autoHideDuration: 3000});        
    }    
  
    const onDelete = (id) => {
        deleteTodoMutation.mutate({id});           
        enqueueSnackbar('Задача удалена!',{autoHideDuration: 3000});
        addToOrder(id);                
    };    

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
                                created: restoreTodo[0].created
                            });

        setOrder(order.filter((item) => item.id !== basketItem));
        enqueueSnackbar('Задача восстановлена!',{autoHideDuration: 3000});        
    };      
    
    const visibleTodos = handleChange(todos,search);

    let content
    if (isLoading) {
        content = <CircularProgress color="secondary" />
    } else if (isError) {
        content = <Alert severity="error">
        {error.message}
       </Alert> 
    } else {
        content = (  
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
                <TodoList
                            todos ={ visibleTodos }                          
                            onDelete={onDelete} 
                        />   
                        </>
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
            {content}
            </Container>
            <Basket 
              order={order}
              removeFromOrder={removeFromOrder}
              cartOpen={isCartOpen}
              closeCart={()=>setCartOpen()}
            />                 
        </main>
    )
}
export default App