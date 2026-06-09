export const delay = (minMs = 500, maxMs = 1000): Promise<void> => {
  const duration = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
