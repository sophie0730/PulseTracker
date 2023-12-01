/* eslint-disable no-underscore-dangle */
export const showDashboard = (req, res) => {
  console.log(`${process.cwd()}/../dist`);
  res.sendFile('index.html', { root: `${process.cwd()}/dist` });
};

export default showDashboard;
