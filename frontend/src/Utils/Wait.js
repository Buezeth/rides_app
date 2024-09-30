export const wait = (t) => new Promise((res) => {
    setTimeout(() => {
      res();
    }, t);
  });