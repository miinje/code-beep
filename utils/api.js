export async function getGithubUser(token) {
  try {
    const githubUser = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!githubUser.ok) {
      throw new Error(`HTTP Error! Status: ${githubUser.status}`);
    }

    return await githubUser.json();
  } catch (error) {
    console.error("GitHub 사용자 정보 가져오기 실패:", error);

    return undefined;
  }
}

async function fetchRecentRepo(token, userName) {
  const url = `https://api.github.com/users/${userName}/repos?sort=updated&direction=desc&per_page=1`;

  try {
    const response = await fetch(url, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    const repos = await response.json();

    if (repos.length > 0) {
      return repos.map((data) => data.name);
    }
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

async function fetchCommitInfo(token, userName, repo) {
  const url = `http://api.github.com/repos/${userName}/${repo}/commits?sort=updated&direction=desc&per_page=1`;
  const HEADERS = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const commitInfo = {};

  const response = await fetch(url, { headers: HEADERS })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.error(err));

  commitInfo.repo = repo;
  commitInfo.commitMessage = response[0].commit.message;
  commitInfo.url = `https://github.com/${userName}/${repo}/commit/${response[0].sha}`;
  commitInfo.sha = response[0].sha;

  return commitInfo;
}

async function fetchCommitFile(token, userName, repo, ref) {
  const url = `http://api.github.com/repos/${userName}/${repo}/commits/${ref}`;
  const HEADERS = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { headers: HEADERS })
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.error(err));

  return response;
}

export async function fetchCommitCode(token, userName) {
  const repoName = await fetchRecentRepo(token, userName);
  const commitInfo = await fetchCommitInfo(token, userName, repoName[0]);
  const file = await fetchCommitFile(
    token,
    userName,
    repoName[0],
    commitInfo.sha
  );

  return file;
}
