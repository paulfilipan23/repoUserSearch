import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 8083;
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.get("/:searchValue", async (req, res) => {
  const { searchValue } = req.params;
  try {
    const responseRepo = await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}&sort=stars&order=desc&per_page=15`,
      {
        headers: {
          Accept: "application/vnd.github.v3.text-match+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    let resultData = [];
    const data = await responseRepo.json();
    if (data) {
      const { items } = data;
      if (items && items.length) {
        resultData = [
          ...items.map((item) => {
            return {
              userName: item.owner.login,
              repoName: item.name,
              url: item.html_url,
              type: "repo",
            };
          }),
        ];
      }
      //create a list with name of the repo and name of the owner
    }

    const responseUsers = await fetch(
      `https://api.github.com/search/users?q=${searchValue}&per_page=15`,
      {
        headers: {
          Accept: "application/vnd.github.v3.text-match+json",
          Authorization: "Bearer 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",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const dataUsers = await responseUsers.json();
    if (dataUsers) {
      const { items } = dataUsers;
      if (items && items.length) {
        resultData = [
          ...resultData,
          ...items.map((item) => {
            return {
              userName: item.login,
              url: item.html_url,
              type: "user",
            };
          }),
        ];
      }
    }
    // order them alphabetically after repoName and userName
    resultData.sort((a, b) => {
      if (a.repoName && b.repoName) {
        return a.repoName.localeCompare(b.repoName);
      } else if (a.userName && b.userName) {
        return a.userName.localeCompare(b.userName);
      }
    });

    return res.json(resultData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
