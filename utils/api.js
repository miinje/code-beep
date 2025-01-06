export async function getGithubUser(token) {
  const githubUser = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return githubUser.json();
}

export async function fetchRecentRepo(userToken, userName) {
  const url = `https://api.github.com/users/${userName}/repos?sort=updated&direction=desc&per_page=1`;

  try {
    const response = await fetch(url, {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    });
    const repos = await response.json();
    if (repos.length > 0) {
      return repos[0].name;
    } else {
      console.log("리포지토리가 없습니다.");
    }
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

async function fetchFilesRecursive(
  accessToken,
  owner,
  repo,
  path = "",
  depth = 0,
  maxDepth = 3
) {
  if (depth > maxDepth) return []; // 최대 탐색 깊이 초과 시 종료

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const HEADERS = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  if (visitedPaths.has(path)) {
    return [];
  }

  visitedPaths.add(path);

  const response = await fetch(url, { headers: HEADERS });
  const files = await response.json();

  let codeFiles = [];

  if (!Array.isArray(files)) {
    codeFiles.push({ path: files.path, download_url: files.download_url });
  } else {
    for (const file of files) {
      if (file.type === "dir") {
        const nestedFiles = await fetchFilesRecursive(
          accessToken,
          owner,
          repo,
          file.path,
          depth + 1,
          maxDepth
        );

        codeFiles = codeFiles.concat(nestedFiles);
      } else if (file.type === "file") {
        codeFiles.push({ path: file.path, download_url: file.download_url });
      }
    }
  }

  return codeFiles;
}

export async function getCodeFiles(accessToken, userName, repo) {
  const filesWithCode = await fetchFilesRecursive(accessToken, userName, repo);

  return filesWithCode;
}
