import React, { useRef, useState, useEffect } from "react";
import { getTweets } from "services/HttpService";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tweet from "components/Tweet";
import { move, reorder } from "utils/helpers";

const StyledHeader = styled.header`
  height: 80px;
  background-color: #73a1ca;
  text-align: center;
  padding-top: 10px;
  font-family: monospace;
  font-size: 42px;
  color: #e0dada;
`;

const Main = styled.div`
  padding: 40px;
`;

const ListContainer = styled.div`
  height: 600px;
  display: flex;
  flex-direction: row;
  & > div {
    margin: 10px;
    flex: 1;
  }
`;

const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  overflow: "scroll"
});

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [savedTweeets, setSavedTweets] = useState(
    JSON.parse(window.localStorage.getItem("saved-tweets")),
  );
  const textField = useRef(null);

  const onButtonClick = async () => {
    const response = await getTweets(textField.current?.value);
    setTweets(response.statuses);
  };

  useEffect(() => {
    window.localStorage.setItem("saved-tweets", JSON.stringify(savedTweeets));
  }, [savedTweeets]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        source.droppableId === "saved-list" ? savedTweeets : tweets,
        source.index,
        destination.index,
      );

      source.droppableId === "saved-list"
        ? setSavedTweets(items)
        : setTweets(items);
    } else {
      const result =
        source.droppableId === "saved-list"
          ? move(savedTweeets, tweets, source, destination)
          : move(tweets, savedTweeets, source, destination);

      setSavedTweets(result["saved-list"]);
      setTweets(result["search-list"]);
    }
  };

  return (
    <div>
      <StyledHeader className="App-header">Tweet Saver</StyledHeader>
      <Main>
        <input ref={textField} type="text" />
        <input type="button" onClick={onButtonClick} value="Search" />
        <ListContainer>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="search-list">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {tweets.map((item, index) => (
                    <Draggable
                      key={item.id_str}
                      draggableId={item.id_str}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <Tweet
                            imageUrl={item.user.profile_image_url}
                            name={item.user.name}
                            handle={item.user.screen_name}
                            date={item.created_at}
                            text={item.text}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="saved-list">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {savedTweeets.map((item, index) => (
                    <Draggable
                      key={item.id_str}
                      draggableId={item.id_str}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                           <Tweet
                            imageUrl={item.user.profile_image_url}
                            name={item.user.name}
                            handle={item.user.screen_name}
                            date={item.created_at}
                            text={item.text}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ListContainer>
      </Main>
    </div>
  );
}

export default App;
