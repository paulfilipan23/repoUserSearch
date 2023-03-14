import { render, screen, fireEvent, act } from "@testing-library/react";
import { CardDisplay } from "./Autocomplete";
import Autocomplete from "./Autocomplete";
const propsRepo = {
  item: {
    url: "www.google.com",
    type: "repo",
    userName: "testUser",
    repoName: "testRepo",
  },
  selectedIndex: 0,
  index: 0,
};

const propsRepoNot = {
  item: {
    url: "www.google.com",
    type: "repo",
    userName: "testUser",
    repoName: "testRepo",
  },
  selectedIndex: 0,
  index: 1,
};

const propsUser = {
  item: {
    url: "www.google.com",
    type: "user",
    userName: "testUser12",
  },
  selectedIndex: 0,
  index: 0,
};
test("renders CardDisplay userName for repo component", () => {
  render(<CardDisplay {...propsRepo} />);
  const linkElement = screen.getByText("testUser");
  expect(linkElement).toBeInTheDocument();
});

test("renders CardDisplay testRepo  for repo component", () => {
  render(<CardDisplay {...propsRepo} />);
  const linkElement = screen.getByText("testRepo");
  expect(linkElement).toBeInTheDocument();
});

test("renders CardDisplay userName  for user component", () => {
  render(<CardDisplay {...propsUser} />);
  const linkElement = screen.getByText("testUser12");
  expect(linkElement).toBeInTheDocument();
});

test("renders CardDisplay testRepo  for user component", () => {
  render(<CardDisplay {...propsUser} />);
  //test to not have repoName
  const linkElement = screen.queryByText("testRepo12");
  expect(linkElement).not.toBeInTheDocument();
});

// test that if the selected index is 0, the background color is blue
test("renders CardDisplay background color for repo when selected", () => {
  render(<CardDisplay {...propsRepo} />);
  const linkElement = screen.getByTestId("card");
  expect(linkElement).toHaveStyle("background-color: #91A7FF");
});

test("renders CardDisplay background color for repo when not selected", () => {
  render(<CardDisplay {...propsRepoNot} />);
  const linkElement = screen.getByTestId("card");
  expect(linkElement).toHaveStyle("background-color: #74C0FC");
});

test("input value changes when user types", () => {
  render(<Autocomplete placeholder="Search" />);
  const input = screen.getByPlaceholderText("Search");
  fireEvent.change(input, { target: { value: "react" } });
  //@ts-ignore
  expect(input.value).toBe("react");
});

test('displays "No results found" message when results is empty', () => {
  render(<Autocomplete placeholder="Search" />);
  const input = screen.queryByText("No results found");
  expect(input).toBeInTheDocument();
});

test("makes an API call and displays the results when searchTerm has 3 or more characters", async () => {
  const mockData = [
    {
      id: 1,
      repoName: "React",
      url: "https://reactjs.org",
      userName: "facebook",
      type: "repo",
    },
    {
      id: 2,
      repoName: "React Native",
      url: "https://reactnative.dev",
      userName: "facebook",
      type: "repo",
    },
  ];
  const fetchMock = jest.spyOn(global, "fetch").mockImplementation(
    () =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      }) as any
  );
  render(<Autocomplete placeholder="Search" />);
  mockData.forEach((item) => {
    render(<CardDisplay item={item} index={0} selectedIndex={0} />);
  });
  const input = screen.getByPlaceholderText("Search");
  fireEvent.change(input, { target: { value: "re" } });
  //wait 300ms for the API call to be made
  await act(async () => {
    await new Promise((r) => setTimeout(r, 500)); // add a delay to simulate API call
  });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith("http://localhost:8083/react");
  const results = await screen.findAllByTestId("card");
  expect(results).toHaveLength(2);
  expect(results[0]).toHaveTextContent("React");
  expect(results[1]).toHaveTextContent("React Native");
});
