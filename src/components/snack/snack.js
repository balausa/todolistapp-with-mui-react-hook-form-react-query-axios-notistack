import { Snackbar,Alert } from '@mui/material'
import React from 'react'

const Snack = ({isOpen, handleClose=Function.prototype}) => {

  const renderSwitch=(isOpen)=>{
    switch(isOpen) {
      case 'new':
        return <Alert severity="success">
        Создана новая задача!
       </Alert> 
      case 'delete':
        return <Alert severity="info">
        Задача удалена!
       </Alert>;
      case 'restore':
        return <Alert severity="info">
        Задача восстановлена!
       </Alert>;
      default:
        break;       
    }
  }

  return (
    <Snackbar
        open={!!isOpen}
        onClose={handleClose}
        autoHideDuration={1500}
    >
      { renderSwitch(isOpen)}
    </Snackbar>
  )
}

export default Snack