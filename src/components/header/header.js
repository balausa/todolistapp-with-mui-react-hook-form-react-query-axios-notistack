import React from 'react';
import { AppBar, IconButton, Toolbar, Typography,Badge, TextField } from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

function Header({ handleCart, orderLen, onChange }) {

  const [search, setSearch]= useState('');

  const onSearch=(e)=>{
    const term = e.target.value;
      setSearch(term);
      onChange(term);
}
  return (
    <AppBar position="static">
        <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
                My TodoList
            </Typography>   
            <SearchIcon />     
            <TextField      
              label="Поиск"
              variant="standard"
              size="1000"                             
              type='search' 
              value={search} 
              onChange={onSearch} 
              sx={{mb:'1.5rem', width: '25rem'}}/>          
            <IconButton
              color="inherit"
              onClick={handleCart}
            >
              <Badge
              color="secondary"
              badgeContent={orderLen}
              >
                <ShoppingBasket/>
              </Badge>
            </IconButton>
        </Toolbar>
    </AppBar>
  )
}

export default Header

