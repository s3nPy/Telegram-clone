import React from "react";
import { IconButton } from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/Phone';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import { useDispatch, useSelector } from "react-redux";
import { AppActions, UserActions } from "../../redux/actions";
import useInput from "../../hooks/input.hook";
import ChatMenu from "../chatMenu/ChatMenu";
import AvatarWrapper from "../avatar/AvatarWrapper";
import "./Chat.scss";

const Chat = () => {
  const dispatch = useDispatch()
  const username = useSelector(state => state.user.username)
  const chat = useSelector( state => state.user.activatedChat )
  const message = useInput()

  const submitHandler = e => {
    e.preventDefault()

    if(message.value.trim()) {
      dispatch(UserActions.sendMessage(message.value, chat))
      message.clear()
    }
  }

  const openChatMenu = () => {
    dispatch(AppActions.toggleChatMenu())
  }

  if(!chat) {
    return ( 
      <div className="chat null">
        <p>Please select a chat to start messaging</p>
      </div>
    )
  }

  return (
    <div className="chat">
      <ChatMenu />

      <div className="header">
        <AvatarWrapper chat={chat}/>
        <div className="user">
          <p>
            {
            chat.private ? 
            chat.members.find(m => m.username !== username).username : 
            chat.title
            }
          </p>
          <small className="members">{chat.members.length} members</small>
        </div>
        <div className="tools">
          <IconButton>
            <PhoneIcon />
          </IconButton>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton onClick={openChatMenu}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="body">
        {
          chat.messages.map(msg => 
            msg.system ? (
              <p 
                key={msg._id} 
                className={"message " + (msg.system ? 'system' : '')}
              >
                <span className="text">{msg.text}</span>
              </p> 
            ) : (
              <div 
                key={msg._id} 
                className={"message " + (msg.author.username === username ? 'owner' : '')}
              >
                {
                  msg.author.username !== username && <AvatarWrapper user={msg.author}/>
                }
                <p className="content">
                  <span className="username">{msg.author.username}</span>
                  <span className="text">{msg.text}</span>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </p>
                {
                  msg.author.username === username && <AvatarWrapper user={msg.author}/>
                }
              </div> 
            )
          )
        }

      </div>

      <div className="message-form">
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="Write a message..." {...message.bind}/>
          <button type="submit">submit</button>
        </form>
        
        <IconButton>
          <SentimentSatisfiedOutlinedIcon />
        </IconButton>
        <IconButton>
          <MicNoneOutlinedIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default Chat;
