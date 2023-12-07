/* eslint-disable no-underscore-dangle */
export const showDashboard = (req, res) => {
  res.sendFile('index.html', { root: `${process.cwd()}/dist` });
};

export default showDashboard;
