import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Chat from '../../components/chat/Chat'
import Sidemenu from '../../components/sidemenu/Sidemenu'
import ChatCreator from '../../components/chatCreator/ChatCreator'
import ChatContacts from '../../components/contacts/ChatContacts'
import UserContacts from '../../components/contacts/UserContacts'
import ContactCreator from '../../components/contactCreator/ContactCreator'
import InviteContacts from '../../components/contacts/InviteContacts'
import './MainPage.scss'

const MainPage = () => {
  return (
    <>
      <Sidemenu />

      <ChatCreator />
      <ContactCreator />
      <InviteContacts />

      <ChatContacts />
      <UserContacts />

      <Sidebar />
      <Chat />
    </>
  )
}

export default MainPage
