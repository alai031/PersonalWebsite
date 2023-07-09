import react from "react";
import { Button } from "@mui/material";
import StartingPage from "./StartingPage";
import { io } from 'socket.io-client';
import Chatroom from './Chatroom';
import Form from "../Components/form.js";

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            username: undefined,
            screen: "starting",
            showForm: false,
            selectedForm: undefined,
            room: undefined,
            rooms: [],
        }
        this.socket = io('http://localhost:3001', 
            {
            cors:{origin: 'http://localhost:3001',
            credentials: true},
            transports: ['websocket']
            }); 
    }

    componentDidMount(){
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => { 
            res.json().then((data) => {
                this.setState({rooms:data})
            })
        });
    }

    /* roomSelect = (room, username) => {
        this.socket.emit("join", {"room":room, "username":username});
        this.setState({room:room, screen:"chat"})
    } */

    sendChat = (text) => {
        console.log("SENDING")
        this.socket.emit("chat message", text)
    }

    goBack = ()=>{
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => { 
            res.json().then((data) => {
                this.state.rooms = data;
                console.log("ROOMS INFO:", this.state.rooms)
                this.setState({rooms:data})
            })
        });
        this.setState({screen:"starting"})
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    createRoom = (data) => {
        fetch(this.props.server_url + '/api/rooms/create', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data),
        }).then((res) => {
            res.json().then((data) => {
                console.log("DATA:", data)
                if (data.msg !== "Room already exists. Please choose a unique name."){
                    this.joinRoom({name:data.name})
                }
                else{
                    alert(data.msg);
                }
            });
        });
    }

    joinRoom = (roomObj) => {
        fetch(this.props.server_url + '/api/rooms/join', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(roomObj),
        }).then((res) => {
            res.json().then((data) => {
                if (data.msg === "Room Found"){
                    this.socket.emit("join", {"room":roomObj.name, "username":data.username});
                    this.socket.emit("grab history")
                    //this.socket.emit("grab history", {"room":roomObj.name})
                    this.setState({showForm: false});
                    this.setState({screen: "chat"});
                    this.setState({room: roomObj.name});
                    this.setState({username:data.username})
                    this.state.room = roomObj.name;
                    if(!(this.state.rooms.includes(roomObj.name))) //STUCK HERE
                        this.state.rooms.push(roomObj.name);
                }
                else{
                    alert(data.msg);
                }
            });
        });
    }

    deleteRoom = (roomObj) => {
        fetch(this.props.server_url + '/api/rooms/leave', {
            method: "DELETE",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(roomObj),
        }).then((res) => {
            res.json().then((data) => {
                if (data.msg === "Room Deleted"){
                    this.setState({showForm: false});
                    this.socket.emit("room delete", roomObj)
                    fetch(this.props.server_url + '/api/rooms/all', {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((res) => { 
                        res.json().then((data) => {
                            this.state.rooms = data;
                            this.setState({rooms:data})
                        })
                    });
                }
                else{
                    alert(data.msg);
                }
            });
        });
    }

    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "createRoom"){
                fields = ['name'];
                display = <Form fields={fields}
                close={this.closeForm}
                type="Enter the name of the room you'd like to create: "
                submit={this.createRoom}
                key={this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm === "joinRoom"){
                fields = [ 'name'];
                display = <Form 
                fields={fields} 
                close={this.closeForm} 
                type="Enter the room you'd like to join: " 
                submit={this.joinRoom} 
                key={this.state.selectedForm}/>;
            } 
            else if (this.state.selectedForm === "deleteRoom"){
                fields = [ 'name'];
                display = <Form 
                fields={fields} 
                close={this.closeForm} 
                type="Enter the room you'd like to delete: " 
                submit={this.deleteRoom} 
                key={this.state.selectedForm}/>;
            } 
        }
        else{
            display = <div>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"createRoom"})}> Create a room </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"joinRoom"})}> Join a room </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"deleteRoom"})}> Delete a room </Button>
            </div>;
        }

        this.socket.on('update room after deletion', (data)=>{
            fetch(this.props.server_url + '/api/rooms/all', {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => {
                res.json().then((data) => {
                    this.state.rooms = data;
                    this.setState({rooms:data})
                })
            });
        })

        return(
            <div>
                {this.state.screen === "starting" ? <h1>Lobby</h1> : <div> Room: {this.state.room} </div>}
                {this.state.screen === "starting" ?
                    <StartingPage rooms={this.state.rooms} roomSelect={this.roomSelect}></StartingPage>
                    : <Chatroom username={this.state.username} sendChat={this.sendChat} socket={this.socket} goBack={this.goBack}></Chatroom>}
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                {this.state.screen === "starting" ? 
                    display
                    : <div></div>}
            </div>
        );
    }
}

export default Lobby;