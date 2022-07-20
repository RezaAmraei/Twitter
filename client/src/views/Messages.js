import React,{useState, useEffect} from 'react'
import "../CSS/Messages.css"
import io from 'socket.io-client';
import route from "../utils/server_router";
import ProfileMessageCard from '../components/ProfileMessageCard';
import Button from '@mui/material/Button';
import axios from "axios";
import FollowersAndFollowingModal from "../components/FollowersAndFollowingModal";


const Messages = () => {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    const socket = io.connect(route);
    const user = JSON.parse(localStorage.getItem("currUser"));
    const [followingInfo, setFollowingInfo] = useState([])

    useEffect(() => {
        socket.on('receive_message', data =>{
          setMessageReceived(data.message)
        });
        return () => socket.disconnect(true);
    }, [socket])
    
    const sendMesssage = () =>{
      socket.emit("send_message", {message})
    }
  return (
    <div className='messageMainDiv flex'>
      
      <div className="messagesProfileSection">
        <div className='messagesHeader'>Messages</div>
        <div className='divForSearchBar'>
          <input
           placeholder='Search Direct Messages'
           className='messagesSearchBar'
           />
        </div>
        <ProfileMessageCard className="t"/>
      </div>

      <div className="messagesConvoSection">
        <div id='messagesConvoSectionHeader'>Select a message</div>
        <div id="messagesConvoSectionSubHeader">Choose from your existing conversations, start a new one, or just keep swimming.</div>
        <div>
               <FollowersAndFollowingModal
               num={`New Message`}
               relationship={followingInfo}
               />
               </div>
      </div>

    </div>
  )
}

export default Messages

/*            BASIC VERSION OF SOCKET IO, WORKING
    <div className='messageMainDiv'>
      <input placeholder='Message...' onChange={(e) => setMessage(e.target.value)}/>
      <button onClick={sendMesssage}>Send Message</button>
      <h1>Message : {messageReceived}</h1>
    </div>
*/