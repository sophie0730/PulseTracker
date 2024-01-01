
# PulseTracker

![release](https://badgen.net/github/release/sophie0730/PulseTracker/stable)

PulseTracker is an application for developers to monitor server and application status in one place, and trigger alerts. 

It allows users to configure their alerting rules and metrics target URLs using YAML files.

![pulsetracker](https://github.com/sophie0730/PulseTracker/assets/112261858/a02247b7-791f-422d-ade9-fb4f5cedb316)

## Menu

[Demo Video](#demo-video) | [Prerequisites](#prerequisites) | [Install](#install) | [Environment Variables](#environment-variables) | [YAML File Configuration](#yaml-file-configuration) | [Getting Started](#getting-started) | [Features](#Features) | [Architecture Overview](#architecture-overview) | [Built With](#built-with) | [Contact](#contact)

## Demo Video
[![PulseTracker Demo](https://img.youtube.com/vi/LUZDCWmqmbs/mqdefault.jpg)](https://youtu.be/LUZDCWmqmbs?si=f_mQrlOy27Ezaz8K)

## Prerequisites

Please make sure your Linux environment is prepared before you start the installation process.

**1. Docker Installation**

PulseTracker requires Docker. If you haven't installed Docker yet, please follow the instructions provided in the Docker document: [Install Docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

**2. Linux Commands**
  
    Run the following commands to update your system and install necessary tools:
    ```
    sudo apt-get update
    sudo apt-get install sysstat
    ```

**3. Time Synchronization**

    Ensure your Linux system time is accurate. Use the NTP tool for time synchronization.
    ```
    sudo apt update 
    sudo apt install ntp 
    sudo systemctl start ntp 

    sudo systemctl enable ntp 
    ```
    
**4. Nginx Installation (optional)**

If you plan to use `nginx_exporter`, please install Nginx on your machine first.

**5. Network setting for AWS services** 

For AWS EC2 users, add ports 4000, 9100, 9101, 8086, 6379 to the inbound rules of your security group.

<p align="right"><a href="#top">Back to Top</a></p>

## Install

Precompiled binaries for released versions are available in the
[GitHub Releases](https://github.com/sophie0730/PulseTracker/releases). Using the latest release binary
is the recommended way of installing PulseTracker.

Follow these steps to set up and start using PulseTracker on your machine.

**1. Download and Decompress the Release Package**

Download your preffered version of PulseTracker from the GitHub Release.
```
wget [GitHub_release_package_url]

tar xvf [package_name].tar

```

**2. Setting Up InfluxDB and Redis with Docker Compose**

If InfluxDB or Redis has been installed on your machine, you may need to config `docker-compose.yml` to suit your setup. 

Then, start the services using Docker Compose.
```
docker compose up -d
```

**3. Config InfluxDB**

Access InfluxDB at [HOST]:8086 and set up an `organization`, a `bucket`, and an `API token`.

**4. Update Environment setting**

Modify the `.env.templete` with your InfluxDB settings. Remember to rename this file to `.env` after you entered all the necessary information.

Please refer to [Environment Variable] section for detail setting information.

**5. Customize Configuration Files**

Modify `pulse.yml` and `alert.yml` according to your specific needs and environment setting.

**6. Optional: Email and Line Notification**

If you need to send alerts via emails or Line messages, register with a SMTP server (like Mailgun) and obtain a Line Notify token from [Line Notify](https://notify-bot.line.me/zh_TW/).

**7. Start the Exporters**

To fetch system-level data and application-level data, please launch the [system](https://github.com/sophie0730/pulsetracker-server-exporter/releases) and [nginx](https://github.com/sophie0730/pulsetracker-nginx-exporter/releases) exporters. By default, these exporters run on port 9100(server) and 9101(nginx).

```
./server_exporter
```
```
./nginx_exporter
```

**8. Run PulseTracker server**

Finally, start PulseTracker server.
```
./pulsetracker
```

You are now ready to use PulseTracker on your machine.

<p align="right"><a href="#top">Back to Top</a></p>

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`INFLUXDB_URL` : This should be set according to the host and port of your InfluxDB.

`ORG`, `BUCKET` : These values should be configured based on your [initial setup](#Install) of InfluxDB.

`MEASUREMENT`, `ALERT_MEASUREMENT`: These are the names of the tables where your data is stored. You can assign any names you prefer.

`TOKEN`: API token you set for InfluxDB.

`EMAIL_USER`, `EMAIL_TOKEN`: These should be set according to your SMTP configuration.

`LINE_URL`, `LINE_TOKEN`: These should be configured based on your Line Notify setting.

```
# Please follow the below example

#INFLUXDB_URL based on your host and port
INFLUXDB_URL='http://52.62.225.143:8086' 

# ORG and BUCKET based on your setting on InfluxDB
ORG='personal'
BUCKET='pulse_tracker'

# You can named what you want for MEASUREMENT and ALERT_MEASUREMENT 
MEASUREMENT='metrices'
ALERT_MEASUREMENT='alert'

# The API token you set on InfluxDB
TOKEN='' 

# (optional) If you want to set email and Line message function
# Please use SMTP server (e.g. Mailgun) and Line Notify service
EMAIL_USER='postmaster@sandbox528dfcb25def4a599f04946671360d35.mailgun.org'
EMAIL_TOKEN=''

LINE_URL='https://notify-api.line.me/api/notify'
LINE_TOKEN=''
```

<p align="right"><a href="#top">Back to Top</a></p>

## YAML File Configuration

**Pulse.yml**

You can customize some PulseTracker settings through this yaml file. This includes configuring the worker frequency, setting up alerting receivers and specifying target URLs for metrics.

An example configuration is provided below for reference.
```
global:
  store_timeout: 10 # set store metrices worker every 10 seconds. unit: second 
  alert_timeout: 10 #set alert worker every 10 seconds. unit: second 

# Alertmanager configuration
alerting:
  static_configs:
    receivers: 
      - target: "r09426003@ntu.edu.tw"  # Set your recepients' email

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
# The default name of alerting rule file is alert.yml
rule_files:
   - "alert.yml" 

# If your influxDB or redis are on other ports, please modify the below option
influx_db:
  execute_path: "/usr/local/bin/influxd"
  port: 8086

redis:
  port: 6379

# A scrape configuration containing exactly one endpoint to scrape:
# If your maching is built in other IPs, please replace "localhost" to your IP. e.g. 52.62.225.143:4000
#Please do not modify the first job_name "pulsetracker_server". The default target is [YOUR HOST]:4000
# You can add your servers according to the below format.

scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "pulsetracker_server"  
    scheme: http
    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.
    static_configs:
      targets: "localhost:4000"

  - job_name: 'system'
    scheme: http
    static_configs:
      targets: "localhost:9100"
    metrics_path: '/metrics'

  - job_name: 'nginx-application'
    scheme: http
    static_configs:
      targets: "localhost:9101"
    metrics_path: '/metrics'
```

**alert.yml**

You have the flexibility to add or remove alerting rules as per your requirements.

```
groups: 
# Please add your alerting rules
- name: # The title of alerting rule
  rules:
  - alert: # The title of alerting rule
    expr: # The alerting rule. Please follow influxDB query.
    for:  # The duration of 
    annotations:
      summary: # The summary of this rule.
```
```
# For example
groups:
- name: server_is_down 
  rules:
  - alert: server_is_down
    expr: 'fn: (r) => r.item == "up" and r._value == 0'
    for: 15s
    annotations:
      summary: Server(s) are down.
```

<p align="right"><a href="#top">Back to Top</a></p>

## Getting Started

- Create a dashboard
![create_dashboard (1)](https://github.com/sophie0730/PulseTracker/assets/112261858/d7cf00f4-2308-4822-b15b-9a57d3db32c2)

- Add graph in your dashboard
![add_graph (1) (1)](https://github.com/sophie0730/PulseTracker/assets/112261858/7f080110-ccd1-462b-a796-a9b8f8b0fe2b)


<p align="right"><a href="#top">Back to Top</a></p>

## Features
- Dashboard
![dashboard](https://github.com/sophie0730/PulseTracker/assets/112261858/ba203a91-f691-4be2-abe4-f10f7e69f8d6)

- Change graph type as per your requirement.
![change_graph](./documentation/images/change_graph_type%20(1).gif)


- Target status
![target_status](https://github.com/sophie0730/PulseTracker/assets/112261858/6a16a00d-767b-4763-8da3-886de84eb10a)

- Alerts
![alert](https://github.com/sophie0730/PulseTracker/assets/112261858/21b8f9ef-2567-4330-99ba-cbe86e45334c)


- Config alerting rules as per your requirement.
![config_alert](./documentation/images/config_alertt.gif)

- Triggering alerts
![send_alert](./documentation/images/send_alert.gif)

<p align="right"><a href="#top">Back to Top</a></p>

## Architecture Overview

![final_structure_pulsetracker20231229](https://github.com/sophie0730/PulseTracker/assets/112261858/a54749ec-8693-43a7-a2ce-8698169bfad2)
## Built With

<table>
  <tbody>
    <tr>
      <th text-align="center">Back-End</th>
      <th>Front-End</th>
      <th>Tools</th>
    </tr>
    <tr>
      <td style="vertical-align:top">
        <li><a href="https://nodejs.org/en/">Node.js</a></li>
        <li><a href="https://bun.sh/">Bun</a></li>
        <li><a href="https://expressjs.com/">Express</a></li>
        <li><a href="https://redis.io/">Redis</a></li>
        <li><a href="https://www.influxdata.com/">InfluxDB</a></li>
      </td>
      <td style="vertical-align:top">
        <li>HTML5</li>
        <li>CSS3</li>
        <li><a href="https://reactjs.org/">React</a></li>
        <li><a href="https://mui.com/">MUI</a></li>
        <li><a href="https://www.chartjs.org/">Chart.js</a></li>
      </td>
      <td style="vertical-align:top">
        <li>Git, GitHub</li>
        <li><a href="https://www.docker.com/">Docker</a></li>
        <li><a href="https://www.nginx.com/">Nginx</a></li>
        <li><a href="https://mochajs.org/">Mocha</a></li>
        <li><a href="https://www.chaijs.com/">Chai</a></li>
        <li><a href="https://www.postman.com/">Postman</a></li>
      </td>
    </tr>
  </tbody>
</table>

<p align="right"><a href="#top">Back to Top</a></p>

## Contact

- [Sophie (Hsuan-Ni) Hsu (許玄妮)](https://www.github.com/sophie0730)
- Email: sophy010017@gmail.com

<p align="right"><a href="#top">Back to Top</a></p>


