export const checkLoggedIn = async () => {
  const response = await fetch(`/api/checkLogin`, {
    method: "POST",
  });
  const { msg } = await response.json();
  if (msg === "Unauthorized") {
    return false;
  }
  return true;
};
