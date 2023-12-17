/* eslint-disable no-underscore-dangle */
export const showGraph = (req, res) => {
  res.sendFile('index.html', { root: `${process.cwd()}/dist` });
};

export default showGraph;
