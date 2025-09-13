//import { css } from '@emotion/core'
import { MessageBox, ChatItem } from 'react-chat-elements'
import { GridBackground } from '../static/pages/CustomBack'

export const Chatui = () => {
  return (
    <GridBackground className="h-screen overflow-y-scroll md-hidden">
      <div className='bg-white'>
        <ChatItem
          avatar={'https://facebook.github.io/react/img/logo.svg'}
          alt={'Reactjs'}
          title={'Facebook'}
          subtitle={'What are you doing?'}
          date={new Date()}
          unread={0}
        />
      </div>
    </GridBackground>
  )
}

