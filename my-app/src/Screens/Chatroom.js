import react from "react";
import {useState} from "react"
import { Button } from "@mui/material";
import likeEmoji from "../images/like.png"
import dislikeEmoji from "../images/dislike.png"
/* import UserMessage from "../Components/message.js"; */

class Chatroom extends react.Component{
    constructor(props){
        super(props);
        /* this.socket = io('http://localhost:3001') */ //more stuff here
        this.state = {
            username:this.props.username,
            text: '',
            messages: [],
            error: "none",
            showForm: false,
            selectedForm: undefined,
            originalMsg: "",
            newMsg:'',
            id: undefined,
            searchMsg: '',
            searching: false,
        }
    }

    react = (messageId) =>{
        if(this.state.searching === false){
            this.setState({id: messageId, showForm: true, selectedForm:"emoji"})
        }
    }

    searchMessage = (event) => {
        if(this.state.searchMsg === ''){
            console.log("Stop searching. Show all chats.")
            this.setState({searching:false})
            this.props.socket.emit("grab history")
        }
        else{
            console.log("Search in messages for:", this.state.searchMsg)
            this.setState({searching:true})
            this.props.socket.emit("search", this.state.searchMsg)
        }
        event.preventDefault()
        /* this.props.socket.emit("search", this.state.searchMsg) */
    }

    emoji = (data) => {
        //console.log(data.stance)
        this.setState({showForm: false});
        this.props.socket.emit("emoted", {id:this.state.id, stance:data.stance})
    }

    editMessage = (event) => {
        this.setState({showForm: false});
        this.props.socket.emit("edited message", {id:this.state.id, newMsg:this.state.newMsg})
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    render(){

        let display = null;

        if (this.state.showForm){
            //let fields = [];
            if(this.state.selectedForm === "edit"){
                console.log("EDIT")
                display = 
                <div>
                    {this.state.error === "none" ?
                        <div>
                            <button onClick={() => this.closeForm()}> X </button>
                            <form onSubmit={this.editMessage}>
                                <label>
                                Edit your message: 
                                <input type="text" value={this.state.newMsg} onChange={(e) => this.setState({"newMsg":e.target.value} )} />
                                </label>
                                <input type="submit" value="Submit" />
                            </form>
                        </div> 
                        : <></>}
                    {this.state.error === "none" ?
                        <></>
                        : <div>Room does not exist anymore. Please press back button. </div>}
                    <Button onClick={() => this.props.goBack()}> Back to lobby </Button>
                </div>;
            }
            else if(this.state.selectedForm === "emoji"){
                display = 
                <div>
                    {this.state.error === "none" ?
                        <div>
                            <button onClick={() => this.closeForm()}> X </button>
                            <div>
                                React to the message!
                            </div>
                            <button onClick={() => this.emoji({stance:"like"})}>Like</button>
                            <button onClick={() => this.emoji({stance:"dislike"})}>Dislike</button>
                        </div> 
                        : <></>}
                    {this.state.error === "none" ?
                        <></>
                        : <div>Room does not exist anymore. Please press back button. </div>}
                    <Button onClick={() => this.props.goBack()}> Back to lobby </Button>
                </div>;
            }
        }
        else{ display =
            <div style={{width:'auto', height:'auto'}}>
                <div>Send a message:</div>
                {/* { (this.state.error === "none") && (this.state.searching === false) ? 
                    <input type="text" id="text" onChange={(e)=>{this.setState({text:e.target.value})}}/>
                    : <></>}  */}
                { (this.state.error === "exists") || (this.state.searching === true) ? 
                    <></>
                    : <input type="text" id="text" onChange={(e)=>{this.setState({text:e.target.value})}}/>} 
                {this.state.error === "none" ?
                    <></>
                    : <div>Room does not exist anymore. Please press back button. </div>}
                {/* { (this.state.error === "none") && (this.state.searching === false) ?
                    <button onClick={()=>this.props.sendChat(this.state.text)}>send</button>
                    : <></>} */}
                { (this.state.error === "exists") || (this.state.searching === true) ?
                    <></>
                    : <button onClick={()=>this.props.sendChat(this.state.text)}>send</button>}

                {this.state.error === "none" ? 
                    Chatroom
                    : <></>}
            <br></br>
            <Button onClick={() => this.props.goBack()}> Back to lobby </Button>
            </div>;
        }

        this.props.socket.on('room gone', (data)=>{
            //console.log("REACHED HERE")
            if(data.msg == "failed message"){
                this.setState({error:"exists"})
            }
        })

        this.props.socket.on('load history', (history)=>{
            /* if(this.state.searching === false){ */
            /* console.log("CHATROOM MESSAGES", history) */
            if(this.state.searching === false){
                this.setState({messages:history});
            }
            /* } */
        })

        this.props.socket.on('search history', (history)=>{
            this.setState({messages:history});
        })

        return(
            <div>
                <div>
                    <form onSubmit={this.searchMessage}>
                        <label>
                        Search the chat: <br></br> 
                        <input type="text" value={this.state.searchMsg} onChange={(e) => this.setState({"searchMsg":e.target.value} )} />
                        </label>
                        <input type="submit" value="Search" />
                    </form>
                </div>
                {/* show chats */}
                <div style={{fontWeight:'bold', marginTop:'20px'}}>
                CHATS
                </div>
                <ul>
                    {this.state.messages.map((message)=> 
                    {
                    return <li>
                    
                    <div style={{display:'flex', flexDirection:'row'}}>
                        {/* <div onClick={()=>this.setState({id: message._id, showForm: true, selectedForm:"emoji"})}> */}
                        <div onClick={()=>this.react(message._id)}>
                        {message.sender.name}: {message.message.text} 
                        {(message.emoji) === "like" ? <img style={{width:10, height:10}} src={likeEmoji} alt="likeEmoji"/>
                            : <></>
                        }
                        {(message.emoji) === "dislike" ? <img style={{width:10, height:10}} src={dislikeEmoji} alt="dislikeEmoji"/>
                            : <></>
                        }
                        </div>

                        { (this.state.username === message.sender.username) && (this.state.error === "none") && (this.state.searching === false) ? 
                        <button style={{color:"blue"}} onClick={()=>this.setState({id: message._id, showForm: true, selectedForm:"edit", originalMsg:message.message.text, newMsg:message.message.text})}>EDIT</button>
                        : <div></div>}

                    </div>
                    </li>;
                    })
                    }
                </ul>
                {display}
            
            </div>
        );
    }
}

export default Chatroom;