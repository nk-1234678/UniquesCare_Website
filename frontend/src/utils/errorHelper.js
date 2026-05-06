export const getErrorMessage = (err) => {
  if (!err) return "An unknown error occurred";
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message) return err.message;
  return String(err);
};
