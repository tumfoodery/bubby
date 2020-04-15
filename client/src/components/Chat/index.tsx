import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import Input from "components/Input";
import Button from "components/Button";
import Message from "components/Message";
import { noop } from "utils/fn";
import ChatContainer from "./style";

type Message = {
  author: string;
  message: string;
};

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded {
    messageAdded {
      author
      message
    }
  }
`;
let lastMessage = "";
const Chat: React.FC = () => {
  const [name, setName] = useState("bubby");
  const [messages, setMessages] = useState([
    { author: "Admin", message: "Don't be shy, say something!" },
  ]);
  const { data, error } = useSubscription(MESSAGES_SUBSCRIPTION);

  if (error) {
    return <>"you broke it you buy it!"</>;
  }

  if (data?.messageAdded && data.messageAdded.message !== lastMessage) {
    const { author, message } = data.messageAdded;
    setMessages([...messages, ...[{ author, message }]]);
    lastMessage = message;
  }

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setName(value);

  const renderMessages = () => {
    return messages.map(({ author, message }: Message, i) => (
      <Message author={author} key={i} message={message} />
    ));
  };

  return (
    <ChatContainer className="ChatContainer">
      <div>
        {/* <Input
          onChange={onChange}
          placeholder="What's yo name? Cough it up."
          style={{ width: "200px", marginBottom: "40px" }}
        /> */}
        <article className="ChatContainer__message-container">
          {renderMessages()}
        </article>
      </div>
      <MemoInputContainer name={name} />
    </ChatContainer>
  );
};

const SEND_MESSAGE = gql`
  mutation addMessage($author: String!, $message: String!) {
    addMessage(author: $author, message: $message) {
      author
      message
    }
  }
`;

type Props = {
  name: string;
};

const InputContainer: React.FC<Props> = ({ name }) => {
  const [value, setValue] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => setValue(value);

  const onKeyPress = ({ key }: React.KeyboardEvent<HTMLInputElement>): void => {
    if (key === "Enter" && value) {
      onSend(value);
    }
  };

  const onClick = (): void => {
    if (value) {
      onSend(value);
    }
  };

  const onSend = (value: string): void => {
    sendMessage({
      variables: { author: name, message: value },
    }).catch(noop);
  };

  return (
    <div className="ChatContainer__input-container">
      <Input
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder="enter your message..."
        value={value}
      />
      <Button onClick={onClick}>Send Message</Button>
    </div>
  );
};
const MemoInputContainer = React.memo(InputContainer);

export default Chat;
