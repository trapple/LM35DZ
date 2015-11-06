#!/usr/bin/env python

import time
import sys
import spidev
import os
from pprint import pprint

spi = spidev.SpiDev()
spi.open(0, 0)

def readAdc(channel):
  adc = spi.xfer2([0b01101000, 0b00000000])
  #adc = spi.xfer2([0x68, 0x00])
  data = adc[0] + adc[1]
  return data

def convertVolts(data):
  volts = (data * 3.3) / float(1023)
  volts = round(volts, 4)
  return volts

def convertTemp(volts):
  temp = (100 * volts)
  temp = round(temp, 4)
  return temp

if __name__ == '__main__':
  try:
    while True:
      data = readAdc(0)
      volts = convertVolts(data)
      temp = convertTemp(volts)

      os.system('clear')
      print("adc: {:8}".format(data))
      print("volts: {:8.2f}".format(volts))
      print("temp: {:8.2f}".format(temp))

      time.sleep(2)

  except KeyboardInterrupt:
    spi.close()
    sys.exit(0)
