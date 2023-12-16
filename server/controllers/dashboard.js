import * as fs from 'node:fs';
import moment from 'moment';

const filePath = '/home/sophie/personal/server/dashboard-table.json';

function appendToFile(path, dashboardName) {
  let jsonArr = [];

  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    jsonArr = (fileContent === '') ? [] : JSON.parse(fileContent);
  }
  const newObj = {
    id: jsonArr[jsonArr.length - 1].id + 1,
    name: dashboardName,
    createDate: moment().format('YYYY-MM-DD HH:mm:ss(Z)'),
  };

  jsonArr.push(newObj);

  fs.writeFile(path, JSON.stringify(jsonArr, null, 1), (error) => {
    if (error) {
      console.error('Error writing to file', error);
    }
  });
}

export function saveDashboardTable (req, res) {
  const data = req.body;
  const newData = JSON.parse(data.body);
  const dashboardName = newData.inputValue;

  if (!dashboardName || !dashboardName.trim()) return res.status(400).json({ message: 'Dashboard name cannot be empty' });
  if (dashboardName.length > 30) return res.status(400).json({ message: 'Dashboard name should not exceed 30 characters' });

  appendToFile(filePath, dashboardName);
  return res.status(200).json({ message: 'Saving dashboard successfully!' });
}

export function readDashboardTable(req, res) {
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const jsonArr = fs.readFileSync(filePath, 'utf-8');
  if (jsonArr.length === 0 || jsonArr === '') return res.json([]);
  return res.json(JSON.parse(jsonArr));
}

export function deleteDashboardTable(req, res) {
  try {
    const { id } = req.params;
    if (id === undefined || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: 'Your delete action is invalid' });
    }

    const jsonArr = fs.readFileSync(filePath, 'utf-8', (error) => {
      if (error) {
        console.error('Error reading file:', error);
      }
    });
    console.log(Number(id));
    let arr;
    try {
      arr = JSON.parse(jsonArr);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }

    const newJsonArr = arr.filter((item) => item.id !== Number(id));
    fs.writeFile(filePath, JSON.stringify(newJsonArr, null, 1), (error) => {
      if (error) {
        console.error('Error writing to file', error);
      }
    });
    console.log(newJsonArr);

    return res.status(200).json(newJsonArr);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
