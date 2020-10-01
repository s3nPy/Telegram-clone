import React, { useEffect, useState } from 'react'
import { Avatar } from '@material-ui/core'
import { useSelector } from 'react-redux'


const calculateBackgroundColor = id => {
  if(!id) {
    return '#bdbdbd'
  }
  const low = 127*127*127, high = 255*255*255 - 1
  const diversity = 20 * 255
  const num = ( Number.parseInt( id.slice(-10), 16 ) * diversity ) % ( high - low)
  return `#${(num + low).toString(16)}`
}

const AvatarWrapper = ({chat, user}) => {
  const [state, setState] = useState({username: '', src: null})
  const username = useSelector(state => state.user.username)

  useEffect( () => {
    if(chat) {
      if(chat.private) {
        const member = chat.members.find(m => m.username !== username)
        setState( {
          bg: calculateBackgroundColor(member._id),
          username: member.username,
          src: member.avatar?.ref?.url
        })
      } else {
        setState({
          bg: calculateBackgroundColor(chat._id),
          username: chat.title,
          src: null
        })
      }
      
    } else if(user) {
      setState( {
        bg: calculateBackgroundColor(user._id),
        username: user.username,
        src: user.avatar?.ref?.url
      })
    } else {
      setState({
        bg: '#bdbdbd',
        username: '',
        src: null
      })
    }

    // eslint-disable-next-line
  }, [chat, user] )

  return (
    <>
      {
        state.src ? 
          <Avatar src={state.src} />
          :
          <Avatar 
            style={{backgroundColor: state.bg}}
          >
            {state.username ? state.username[0] : 'FW'}
          </Avatar>  
      }
      
    </>
  )
}

export default AvatarWrapper
