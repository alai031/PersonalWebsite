import {useState} from "react"
import { Button } from "@mui/material";

function StartingPage (props) {
    const [username, setUsername] = useState("")
    return (
        <div>
            {props.rooms.map(item => <Button sx={{textTransform:'none'}} variant="contained">{item}</Button>)}
        </div>
    )
}

export default StartingPage