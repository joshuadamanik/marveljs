const SerialPort = require('serialport');
const bufferpack = require('bufferpack');
const util = require('util')

var Delimiter = SerialPort.parsers.Delimiter;

const port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
});

var parser = port.pipe(new Delimiter({delimiter: Buffer.from([0xff, 0x47])}));
parser.on('data', function(buffer) {
  var offset = 0;
  var code = buffer.readUInt16LE(offset); offset += 2;
  console.log(code);

  switch (code) {
    case 1: // Packet of hedgehog coordinates with cm resolution coordinates
      offset += 1;
      data = bufferpack.unpack('<LHHHBBH', buffer, offset); offset += 14;
      console.log('timestamp: ' + data[0] + ', x: ' + data[1] + ', y: ' + data[2] + ', z: ' + data[3] + ', flags: ' + data[4] + ', address: ' + data[5] + ', orientation: ' + data[6]);
      break;

    case 17: // Packet of hedgehog coordinates with mm resolution coordinates
      offset += 1;
      data = bufferpack.unpack('<LLLLBBH', buffer, offset); offset += 14;
      console.log('timestamp: ' + data[0] + ', x: ' + data[1] + ', y: ' + data[2] + ', z: ' + data[3] + ', flags: ' + data[4] + ', address: ' + data[5] + ', orientation: ' + data[6]);
      break;

    case 2: // Packet of all beacons coordinates with cm resolution coordinates
      offset += 1;
      nbeacons = nbytes = buffer.readUInt8(offset); offset += 1;
      beaconsData = [];
      for (var i = 0; i < nbeacons; i++) {
        beaconData = bufferpack.unpack('<BHHH', buffer, offset); offset += 7;
        offset += 1;
        beaconData = {
          'address': beaconData[0],
          'x': beaconData[1],
          'y': beaconData[2],
          'z': beaconData[3]
        }
        beaconsData.push(beaconData);
      }
      data = [nbeacons, beaconsData];
      console.log('nbeacons: ' + nbeacons + ', beaconsData: ' + beaconsData);
      break;

    case 18: // Packet of all beacons coordinates with mm resolution coordinates
      offset += 1;
      nbeacons = nbytes = buffer.readUInt8(offset); offset += 1;
      beaconsData = [];
      for (var i = 0; i < nbeacons; i++) {
        beaconData = bufferpack.unpack('<BLLL', buffer, offset); offset += 13;
        offset += 1;
        beaconData = {
          'address': beaconData[0],
          'x': beaconData[1],
          'y': beaconData[2],
          'z': beaconData[3]
        }
        beaconsData.push(beaconData);
      }
      data = [nbeacons, beaconsData];
      console.log('nbeacons: ' + nbeacons + ', beaconsData: ' + beaconsData);
      break;

    case 3: // Packet of raw inertial sensors data
      break;
    case 4: // Packet of raw distances data
      break;
    case 5: // Packet of processed IMU data
      break;

  }

});
