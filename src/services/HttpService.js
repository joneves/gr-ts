const BASE_URL = `http://localhost:${
  process.env.REACT_APP_PROXY_PORT || 4000
}/`;

export const getTweets = async (search) => {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const request = new Request(
    `${BASE_URL}1.1/search/tweets.json?q=${encodeURIComponent(
      search,
    )}&count=10`,
    {
      headers,
      method: "GET",
    },
  );

  const response = await fetch(request);
  const json = await response.json();

  return json;
};
