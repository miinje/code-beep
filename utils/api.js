export const getGithubUser = async (token) => {
  const githubUser = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return githubUser.json();
};
