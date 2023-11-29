import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/../.env` });

const lineUrl = process.env.LINE_URL;
const token = process.env.LINE_TOKEN;

export async function sendLineMessage(groupName, rule) {
  const data = new URLSearchParams();
  data.append('message', `
  [${groupName}] Your system endpoint has been reached the below alerting rule:\n
  ${rule}
  `);

  axios.post(lineUrl, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log(`${response}, status code: ${response.status}`);
    })
    .catch((error) => console.error(error));
}

export default sendLineMessage;
