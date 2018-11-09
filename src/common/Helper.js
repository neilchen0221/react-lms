export function getValidationErrors(err) {
  const validationErrors = err.inner.reduce((x, y) => {
    x[y.path] = y.message;
    return x;
  }, {});
  return validationErrors;
}

export function redirect(path) {
  const hostUrl = process.env.HOST_URL;
  window.location.href = `${hostUrl}#${path}`;
}
