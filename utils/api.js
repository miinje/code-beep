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
    }
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

async function fetchFilesRecursive(
  accessToken,
  owner,
  repo,
  visitedPaths,
  path = "",
  depth = 0,
  maxDepth = 3
) {
  if (depth > maxDepth) return [];

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
          visitedPaths,
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
  const visitedPaths = new Set();
  const filesWithCode = await fetchFilesRecursive(
    accessToken,
    userName,
    repo,
    visitedPaths
  );

  return filesWithCode;
}

export async function fetchFileContent(fileUrl) {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fileContent = await response.text();

    return fileContent;
  } catch (error) {
    console.error("파일 가져오기 실패:", error);
  }
}
