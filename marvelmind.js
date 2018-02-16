const serialport = require('serialport');

function Marvelmind = function(adr, tty="/dev/ttyACM0", baud=9600, maxvaluescount=3, debug=false, receiveUltrasoundPositionCallback=null, recieveUltrasoundRawDataCallback=null) {
  this.tty = tty;
  this.baud = baud;
  this.debug = debug;
  this.maxvaluescount = maxvaluescount;
  this._bufferSerialDeque = [];

  this.valuesUltrasoundPosition = [];
  this.recieveUltrasoundPositionCallback = recieveUltrasoundPositionCallback;

  this.valuesUltrasoundRawData = [];
  this.recieveUltrasoundRawDataCallback = [];

  this.pause = false;
  this.terminationRequired = false;

  this.adr = adr;
  this.serialPort = None;
};

Marvelmind.prototype.print_position = function () {
  console.log('Hedge ' + this.position()[0] + ': X: ' + this.position()[1] + ' m, Y: ' + this.position()[2] + ' m, Z: ' + this.position()[3] + ' m at time T: ' + this.position()[4]/1000);
};

Marvelmind.prototype.position = function () {
  return this.valuesUltrasoundPosition[this.valuesUltrasoundPosition.length - 1];
};

Marvelmind.prototype.stop = function () {
  this.terminationRequired = True;
  console.log('stopping');
};

Marvelmind.prototype.run = function () {
  while (! this.terminationRequired) {
    if (! this.pause) {
      if (! this.serialPort) {
        this.serialPort = new serialport(this.tty, {
          baudRate = this.baud
        });
      }
      readChar = this.serialPort.read();
    }
  }
};

module.exports = Marvelmind;
