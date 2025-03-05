export async function getGithubUser(token) {
  const url = "https://api.github.com/user";
  const HEADER = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { headers: HEADER });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GitHub 사용자 정보 가져오기 실패:", error);

    return undefined;
  }
}

async function fetchRecentRepo(token, userName) {
  const url = `https://api.github.com/users/${userName}/repos?sort=updated&direction=desc&per_page=1`;
  const HEADER = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers: HEADER });
    const repos = await response.json();

    if (repos && repos.length > 0) {
      return repos.map((data) => data.name);
    }

    throw new Error("No repositories found.");
  } catch (error) {
    console.error("에러 발생:", error);

    throw error;
  }
}

async function fetchCommitInfo(token, userName, repo) {
  const url = `https://api.github.com/repos/${userName}/${repo}/commits?sort=updated&direction=desc&per_page=1`;
  const HEADER = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers: HEADER });
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("No commits found");
    }

    const commit = data[0];

    return {
      repo,
      commitMessage: commit.commit.message,
      url: `https://github.com/${userName}/${repo}/commit/${commit.sha}`,
      sha: commit.sha,
    };
  } catch (error) {
    console.error("커밋 정보 가져오기 실패:", error);

    throw error;
  }
}

async function fetchCommitFile(token, userName, repo, ref) {
  const url = `https://api.github.com/repos/${userName}/${repo}/commits/${ref}`;
  const HEADER = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers: HEADER });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("커밋 파일 정보 가져오기 실패:", error);

    throw error;
  }
}

export async function fetchCommitCode(token, userName) {
  try {
    const repoNames = await fetchRecentRepo(token, userName);
    const repo = repoNames[0];
    const commitInfo = await fetchCommitInfo(token, userName, repo);
    const commitDetail = await fetchCommitFile(
      token,
      userName,
      repo,
      commitInfo.sha
    );
    let selectedFile = null;

    if (commitDetail.files && commitDetail.files.length > 0) {
      for (const file of commitDetail.files) {
        if (file.patch && file.filename.includes("js")) {
          selectedFile = file;

          break;
        }
      }

      if (!selectedFile) {
        selectedFile = commitDetail.files[0];
      }
    } else {
      throw new Error("커밋에 변경된 파일이 없습니다.");
    }

    const HEADER = {
      Authorization: `Bearer ${token}`,
    };
    const fileResponse = await fetch(selectedFile.raw_url, { headers: HEADER });

    if (!fileResponse.ok) {
      throw new Error(
        `파일 내용 가져오기 실패! Status: ${fileResponse.status}`
      );
    }

    const fullFileContent = await fileResponse.text();

    return {
      repo: commitInfo.repo,
      commitMessage: commitInfo.commitMessage,
      commitUrl: commitInfo.url,
      fileName: selectedFile.filename,
      fileContent: fullFileContent,
    };
  } catch (error) {
    console.error("fetchCommitCode 오류:", error);

    throw error;
  }
}
