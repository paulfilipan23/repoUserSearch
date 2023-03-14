import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { CardDisplay } from "./Autocomplete";

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
