# PulseTracker

![release](https://badgen.net/github/release/sophie0730/PulseTracker/stable)

PulseTracker is an application for developers to monitor server and application status in one place, and trigger alerts. 

It allows users to configure their alerting rules and metrics target URLs using YAML files.

## Architecture Overview

![final_structure_pulsetracker drawio](https://github.com/sophie0730/PulseTracker/assets/112261858/f1b48021-ab14-4f66-b2dd-7044b601fc84)


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

To fetch system-level data and application-level data, please launch the system and nginx exporters. By default, these exporters run on port 9100(server) and 9101(nginx).

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


## Getting Started

- Create a dashboard

- Add graph in your dashboard


## Features
- Dashboard
- Change graph type as per your requirement.

- Target status
- Alerts
- Config alerting rules as per your requirement.
- Triggering alerts

## Built With

## Contact

- [Sophie (Hsuan-Ni) Hsu (許玄妮)](https://www.github.com/sophie0730)
- Email: sophy010017@gmail.com