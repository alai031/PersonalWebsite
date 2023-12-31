import react from "react";
/* import Auth from './Screens/Auth.js';
import Lobby from "./Screens/Lobby.js";
import Chatroom from "./Screens/Chatroom.js"; */
import './Styles/Welcome.css'
import { Button } from "@mui/material";

const server_url = "http://localhost:3001";


class ScreenHandler extends react.Component{
    constructor(props){
        super(props);

        this.state = {
            screen: undefined,
        }
    }

    componentDidMount(){
        // checking if the user has active session
        // if yes, then show lobby. if no, then show auth
        /* fetch(server_url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.message == "logged in"){
                    this.setState({screen: "lobby"});
                }
                else{
                    this.setState({screen: "auth"});
                }
            });
        }); */
    }

    changeScreen = (screen) => {
        this.setState({screen: screen});
    }

    /* logout = () => {
        fetch(server_url + '/api/auth/logout', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
        }).then((res) => {
            res.json().then((data) => {
                if (data.msg == "Logged out"){
                    this.setState({screen: "auth"})
                }
                else{
                    alert(data.msg);
                }
            });
        }); 
    } */

    render(){
        let display = "Welcome to Auberon's Website";
        /* let display = "loading...";
        if (this.state.screen == "auth"){
            display = <Auth server_url = {server_url} 
            changeScreen={this.changeScreen}/>;
        }
        else if (this.state.screen == "lobby"){
            display = <Lobby server_url = {server_url}/>;
        }
        else if (this.state.screen == "chatroom"){
            display = <Chatroom server_url = {server_url}/>;
        } */
        return(
            <div>
                <nav id="header" role="navigation">
                    <div id="home">Home</div>
                    <div id="moments">Moments</div>
                    <div id="notifications">Notifications</div>
                    <div id="messages">Messages</div>
                    {/* <a id="skip" href="#content-center">Jump to content-center</a>        */}
                    {/* <img id="twitter-logo" src="twitter-logo.png" alt="image of the twitter logo"></img> */}
                    <div id="TweetButton">Tweet</div>
                    <div id="tweet-shape"></div>
                </nav>
                <div id='wrapper'>
                    <div id='content-left'>
                        HI
                    </div>
                    <div id='content-center'>
                    {display}
                    </div>
                    <div id='content-right'>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default ScreenHandler;
