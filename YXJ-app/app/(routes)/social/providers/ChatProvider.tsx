import { Chat, OverlayProvider } from 'stream-chat-expo';
import { PropsWithChildren, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { ActivityIndicator } from 'react-native';

export const client = StreamChat.getInstance("22x5fn8ue5wr");
export default function ChatProvider({ children }: PropsWithChildren) {

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const setupChat = async () => {
            // 连接用户
            await client.connectUser(
              {
                id: "jlahey",
                name: "Jim Lahey",
                image: "https://i.imgur.com/fR9Jz14.png",
              },
              client.devToken("jlahey")
            );
            setIsReady(true);
          };
          setupChat();

          return ()=>{
            client.disconnectUser();
            setIsReady(false);
          }
        }, []);

        if(!isReady) {
            return <ActivityIndicator/>;
        }
  return (
    <OverlayProvider>
    <Chat client={client}>
      {children}
    </Chat>
    </OverlayProvider>
  );    
}