/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {
  deleteDashboardGraph,
  deleteDashboardTable,
  getDashboardGraph,
  saveDashboardTable,
  updateDashboardGraphType,
} from '../controllers/dashboard.js';

const { expect } = chai;

describe('saveDashboardTable', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

  });

  it('if dashboardName is entered as only whitespace characters, return status code 400', () => {
    req = {
      body: { body: JSON.stringify({ inputValue: '  ' }) },
    };

    saveDashboardTable(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Dashboard name cannot be empty' })).to.be.true;
  });

  it('if dashboardName exceed 30 characters, return status code 400', () => {
    req = {
      body: { body: JSON.stringify({ inputValue: 'abcdefghijklmon1111111111111111' }) },
    };

    saveDashboardTable(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Dashboard name should not exceed 30 characters' })).to.be.true;
  });

});

describe('deleteDashboardTable', () => {
  let req, res, tempFilePath;

  beforeEach(() => {
    tempFilePath = path.join(process.cwd(), 'dashboard-table.json');
    req = { params: { id: '1' } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  it('dashboard should be deleted correctly', () => {
    const testData = {
      objects: [
        {
          id: 1,
          name: "stylish-nginx",
          createDate: "2023-12-18 09:35:42(+08:00)",
        },
        {
          id: 2,
          name: "memory",
          createDate: "2023-12-18 14:11:30(+08:00)",
        },
      ],
      "total": 2,
    };

    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    deleteDashboardTable(req, res);

    expect(res.json.calledWith({
      objects: [
        {
          id: 2,
          name: "memory",
          createDate: "2023-12-18 14:11:30(+08:00)",
        },
      ],
      "total": 2,
    }));
  });
});

describe('getDashboardGraph', () => {
  let req, res, tempFilePath;

  beforeEach(() => {
    tempFilePath = path.join(process.cwd(), 'dashboard-graph.json');
    req = { params: { id: '1' } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  it('shoule return the correct graph', () => {
    const testData = [
      {
        id: 1,
        item: "Max_Response_Time",
        type: "bar-group",
      },
      {
        id: 1,
        item: "Request_Per_Second",
        type: "bar-time",
      },
      {
        id: 4,
        item: "CPU_Load_5m",
        type: "line",
      },
    ];

    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    getDashboardGraph(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith([
      {
        id: 1,
        item: "Max_Response_Time",
        type: "bar-group",
      },
      {
        id: 1,
        item: "Request_Per_Second",
        type: "bar-time",
      },
    ])).to.be.true;
  });

  it('should be return an empty array when the file does not exist', () => {
    getDashboardGraph(req, res);

    expect(res.json.calledWith([])).to.be.true;
  });

  it('should be return an empty array when the file is empty', () => {
    const testData = [];
    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    getDashboardGraph(req, res);

    expect(res.json.calledWith([])).to.be.true;
  });
});

describe('deleteDashboardGraph', () => {
  let req, res, tempFilePath;

  beforeEach(() => {
    tempFilePath = path.join(process.cwd(), 'dashboard-graph.json');
    req = { params: { id: '1', graphName: 'CPU_Average_Usage' } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  it('data should be deleted correctly and return all graph per id', () => {
    const testData = [
      {
        id: 1,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
      {
        id: 1,
        item: "Request_Per_Second",
        type: "bar-time",
      },
      {
        id: 4,
        item: "CPU_Load_5m",
        type: "line",
      },
      {
        id: 4,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
    ];

    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    deleteDashboardGraph(req, res);

    expect(res.json.calledWith([
      {
        id: 1,
        item: "Request_Per_Second",
        type: "bar-time",
      },
    ])).to.be.true;
  });
});

describe('updateDashboardGraphType', () => {
  let req, res, tempFilePath;

  beforeEach(() => {
    tempFilePath = path.join(process.cwd(), 'dashboard-graph.json');
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  it('The type of CPU Average Usage should be updated to line chart', () => {
    req = { params: { id: '1', graphName: 'CPU_Average_Usage' }, body: { type: 'line' } };
    const testData = [
      {
        id: 1,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
      {
        id: 1,
        item: "Memory_Usage",
        type: "bar-group",
      },
      {
        id: 4,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
    ];

    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    updateDashboardGraphType(req, res);
    expect(res.json.calledWith([
      {
        id: 1,
        item: "CPU_Average_Usage",
        type: "line",
      },
      {
        id: 1,
        item: "Memory_Usage",
        type: "bar-group",
      },
    ]));
  });

  it('The status code should return 400 if id is not a number', () => {
    req = { params: { id: 'a', graphName: 'CPU_Average_Usage' }, body: { type: 'line' } };
    const testData = [
      {
        id: 1,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
    ];

    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    updateDashboardGraphType(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Your update action is invalid' }));

  });

  it('The status code should return 400 if id does not exist', () => {
    req = { params: { id: '5', graphName: 'CPU_Average_Usage' }, body: { type: 'line' } };
    const testData = [
      {
        id: 1,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
      {
        id: 2,
        item: "CPU_Average_Usage",
        type: "bar-group",
      },
    ];

    fs.writeFileSync(tempFilePath, JSON.stringify(testData));

    updateDashboardGraphType(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Cannot find CPU_Average_Usage' })).to.be.true;
  });
});
