# PulseTracker

## Prerequisites
- Please install Docker in you Linux Environment.
- You need to install the below Linux command:
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
sudo ntpdate -u pool.ntp.org
```

## How to Use
- Download the compressed file from Github releases.
```
wget https://github.com/sophie0730/PulseTracker/releases/tag/v0.1.0-beta
```

- Create a new directory and decompress the file
```
mkdir pulsetracker
mv pulsetracker_0.1.0-beta_linux.tar ./pulsetracker
tar xvf pulsetracker_0.1.0-beta_linux.tar
```

- Use docker compose to setup InfluxDB and Redis
```
docker compose up
```

- Please sign in InfluxDB([YOUR HOST]:8086) to create a bucket and API token. They will be used for storing your data.

- Edit .env.template according to your InfluxDB settings. Please remember to rename it to .env after editing all the required information.

- (optional) Edit pulse.yml and alert.yml based on your needs.

- Execute exporters (system and nginx application)
```
./exporter
```
These two exporters will be running on port 9100 and 9101 by default.

- Execute PulseTracker server
```
./pulsetracker
```

Now, you are able to use PulseTracker application on your machine.


