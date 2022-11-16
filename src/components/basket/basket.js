import { ShoppingBasket } from '@mui/icons-material';
import { Divider, Drawer, List, ListItem, ListItemIcon,ListItemText, Typography } from '@mui/material';
import React from 'react'
import BasketItem from '../basket-item/basket-item';

 const Basket = (props) => {
    const { cartOpen,
        closeCart=Function.prototype,
        order=[], 
        removeFromOrder} = props;
        
  return (
    <Drawer
    anchor="right"
    open={cartOpen}
    onClose={closeCart}
    >
      <List 
       sx={{width:'350px'}}
       >
        <ListItem>
            <ListItemIcon>
                <ShoppingBasket/>
            </ListItemIcon>
            <ListItemText primary="Корзина"/>
        </ListItem>
        <Divider textAlign="center">
            Удаленные задачи
        </Divider>
        {!order.length ? (
            <ListItem>
             Корзина пуста!
            </ListItem>
        ) : (
            <>
            {order.map((item)=>(                
                <BasketItem 
                    key={item.id} 
                    removeFromOrder={removeFromOrder}
                    {...item}/>))}
        <Divider/>
        <ListItem>
            <Typography sx={{fontWeight:700}}>
                Общее количество:{' '}
                {order.reduce((acc, item) => {
                    return acc + item.quantity;
                }, 0)}
            </Typography>
        </ListItem>
            </>
        )}
        </List>  
    </Drawer>
  )
}
export  default Basket;