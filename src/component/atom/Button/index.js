import React from 'react'
import { Button } from 'reactstrap'

const ButtonCustom = ({title, onClick, loading}) => {
    if (loading){
        return (
            <Button disabled color="secondary"> Proses ... </Button>
        )    
    }
    return (
        <Button color="primary" onClick={onClick}> {title}</Button>
    )
}

export default ButtonCustom;