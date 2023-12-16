import * as fs from 'node:fs';
import moment from 'moment';

const filePath = '/home/sophie/personal/server/dashboard-table.json';

function appendToFile(path, dashboardName) {
  let jsonArr = [];
  let total;

  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileContentJson = (fileContent === '') ? '' : JSON.parse(fileContent);
    jsonArr = (fileContent === '') ? [] : fileContentJson.objects;
    total = (fileContent === '') ? 1 : fileContentJson.total + 1;
  }
  console.log(total);
  const newObj = {
    id: total,
    name: dashboardName,
    createDate: moment().format('YYYY-MM-DD HH:mm:ss(Z)'),
  };
  console.log(newObj);

  jsonArr.push(newObj);

  const data = {
    objects: jsonArr,
    total,
  };

  fs.writeFile(path, JSON.stringify(data, null, 1), (error) => {
    if (error) {
      console.error('Error writing to file', error);
    }
  });
}

export function saveDashboardTable (req, res) {
  try {
    const data = req.body;
    const newData = JSON.parse(data.body);
    const dashboardName = newData.inputValue;

    if (!dashboardName || !dashboardName.trim()) return res.status(400).json({ message: 'Dashboard name cannot be empty' });
    if (dashboardName.length > 30) return res.status(400).json({ message: 'Dashboard name should not exceed 30 characters' });

    appendToFile(filePath, dashboardName);
    return res.status(200).json({ message: 'Saving dashboard successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Save dashboard failed' });
  }

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

    const data = fs.readFileSync(filePath, 'utf-8', (error) => {
      if (error) {
        console.error('Error reading file:', error);
      }
    });
    console.log(Number(id));
    let dataJson;
    let objects;
    let total;
    try {
      dataJson = JSON.parse(data);
      objects = dataJson.objects;
      total = dataJson.total;
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
    const newobjects = objects.filter((item) => item.id !== Number(id));
    const newData = {
      objects: newobjects,
      total,
    };

    fs.writeFile(filePath, JSON.stringify(newData, null, 1), (error) => {
      if (error) {
        console.error('Error writing to file', error);
      }
    });
    console.log(newData);

    return res.status(200).json(newData);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
