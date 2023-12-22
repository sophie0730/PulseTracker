# PulseTracker

This document provides step-by-step instructions to set up PulseTracker on your Linux environment. Please ensure you follow each step carefully for a successfuly installation.

## Prerequisites

Please make sure your Linux environment is prepared before you start the installation process.

1. Docker Installation:

    PulseTracker requires Docker. If you haven't installed Docker yet, please follow the instructions provided in the Docker document: 

- Please install Docker in you Linux Environment first.
You can refer to the below document for install process.
https://docs.docker.com/engine/install/ubuntu/

- Please install the below Linux command:
```
sudo apt-get update
sudo apt-get install sysstat
```
- Please always make sure your Linux time is corrrect.
You can use ntp tool to adjust your environment time.
```
sudo apt update 
sudo apt install ntp 
sudo systemctl start ntp 

sudo systemctl enable ntp 
```

- If you would like to use `nginx_exporter`, please install Nginx in your machine first.

- Please add  port 4000, 9100, 9101, 8086 and 6379 in the inbounding rules on the security groups if you are using AWS EC2 services.

## Install

- Download the compressed file from Github releases.
You can refer to Github releases and download your preffered version
```
wget [package_release_url]
```

- Create a new directory and decompress the file
```
tar xvf [package_name].tar
```

- Use docker compose to setup InfluxDB and Redis
If you have already installed these two services on your machine, you can modify `docker-compose.yml` as you needed.
```
docker compose up -d
```

- Please sign in InfluxDB([YOUR HOST]:8086) to create a organization, bucket and API token. They will be used for storing your data.

- Edit .env.template according to your InfluxDB settings. Please remember to rename it to .env after editing all the required information.

- Edit pulse.yml and alert.yml based on your needs and environment setting.

- (optional) If you would like to send email or Line message, please register a SMTP server(Mailgun or other services) and Line notify(https://notify-bot.line.me/zh_TW/) token.

- Execute exporters (system and nginx application)
```
./server_exporter
```
```
./nginx_exporter
```
These two exporters will be running on port 9100(server) and 9101(nginx) by default.

- Execute PulseTracker server
```
./pulsetracker
```

Now, you are able to use PulseTracker application on your machine.

## Config Files
Please refer to the corresponding examples for each config file.

- docker-compose.yml

If you want to modify Docker setting for InfluxDB or Redis services, please refer to this file.

- Pulse.yml
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

- alert.yml
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

- .env
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

- dashboard-table.json and dashboard-graph.json

The json files which store dashboard data. Please do not edit or remove them.

