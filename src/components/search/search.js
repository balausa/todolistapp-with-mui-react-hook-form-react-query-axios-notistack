import { TextField } from "@mui/material";
import { useState } from 'react';

const Search = ({ onChange }) => {
    const [search, setSearch]= useState('');

const onSearchChange=(e)=>{
      const term = e.target.value;
        setSearch(term);
        onChange(term);
  }
    return <TextField      
            label="Поиск"
            variant="standard"
            size="1000"                             
            type='search' 
            value={search} 
            onChange={onSearchChange} 
            sx={{mb:'1.5rem', width: '25rem'}}/>;
};

export default Search;