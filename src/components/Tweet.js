import React from "react";
import styled from "styled-components";
import moment from "moment";

const DATE_FORMAT = "DD-MM-YYYY HH:mm:ss";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.8rem;
  position: relative;
`;

const Image = styled.div`
  width: 50px;
  padding-right: 5px;
`;

const Inner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: 600;
  margin-right: 30px;
`;

const Text = styled.div`
  padding-top: 4px;
`;

const Date = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
`;


const Tweet = ({ imageUrl, name, handle, date, text }) => {
  return (
    <Wrapper>
      <Image>
        <img src={imageUrl} alt="avatar" />
      </Image>
      <Inner>
        <div>
          <Name>{name}</Name> {handle}{" "}
          <Date>{moment(date).format(DATE_FORMAT)}</Date>
        </div>
        <Text>{text}</Text>
      </Inner>
    </Wrapper>
  );
};

export default Tweet;
