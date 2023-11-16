import * as os from "os";
import * as fs from "fs";
import { exec } from "child_process";


export function getCPUInfo() {
    const cpus = os.cpus();
    console.log(cpus);
    let userTotal = 0,
      niceTotal = 0,
      sysTotal = 0,
      idleTotal = 0,
      irqTotal = 0,
      total = 0;
  
    for (const cpu of cpus) {
      const { user, nice, sys, idle, irq } = cpu.times;
      idleTotal += idle;
  
      total += user + nice + sys + idle + irq;
    }
    const CPUsage = (1 - idleTotal / total);
  
    return CPUsage;
  }

export function getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const memoryUsage = ((usedMem / totalMem) * 100) ;

    return memoryUsage;
}

export function diskRead() {
  let dir = "/dev/vda1";
  let cmd = "df -h --output=pcent " + dir;


  exec(cmd, (error, data) => {
    if (error) {
      console.error(`error: ${error.message}`);
    }

    console.log("SUCCESS", data)

  })
}