"use strict";

const wpi = require('wiring-pi');
const clear = require('clear');
const Milkcocoa = require("milkcocoa")

wpi.wiringPiSPISetup(0, 1000000);

let mk = new Milkcocoa("catignazmfr.mlkcca.com");
let ds = mk.dataStore('temp');


setInterval(() => {
  let buf = new Uint8Array(2);
  buf[0] = 0b01101000; // or 0x68 = ch0利用, ch2を使う場合は0b01111000 or 0x78
  buf[1] = 0b00000000;
  wpi.wiringPiSPIDataRW(0, buf);
  let adc = ((buf[0]<<8) + buf[1]) & 1023; // 10bitのみ使用
  let volts = (adc * 3.3) / 1024;
  volts = Math.round(volts * 10000) / 10000;
  let temp  = Math.round(volts * 100 * 10) / 10;
  let timestamp = new Date();
  clear();
  ds.push({temp, timestamp});
  console.log("adc: ", adc);
  console.log("vlots: ", volts);
  console.log("temp: ", temp);
  console.log(`pushed at ${timestamp}`);
}, 1000 * 60 * 15);
