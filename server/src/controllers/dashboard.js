/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// export const showDashboard = (req, res) => {
//   res.sendFile('dashboard.html', { root: `${__dirname}/../views` });
// };

export const showDashboard = (req, res) => {
  res.sendFile('index.html', { root: `${__dirname}/../dist` });
};

export default showDashboard;
