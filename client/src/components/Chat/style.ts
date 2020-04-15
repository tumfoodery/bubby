import styled from "styled-components";

const ChatContainer = styled.div`
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: 500px;
  margin-bottom: 25px;
  padding: 50px;
  flex-direction: column;
  justify-content: space-between;
  display: flex;

  .ChatContainer {
    &__input-container {
      display: flex;

      > :first-child {
        flex-grow: 1;
      }

      > :last-child {
        margin-left: 15px;
      }
    }
  }
`;
ChatContainer.displayName = "ChatContainer";
export default ChatContainer;
