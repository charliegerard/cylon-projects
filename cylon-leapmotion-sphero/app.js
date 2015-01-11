"use strict"

var Cylon = require('cylon');

Cylon.robot({
	connections: {
		leapmotion: {adaptor: 'leapmotion'},
		sphero: {adaptor: 'sphero', port: '/dev/tty.Sphero-RBR-AMP-SPP'}
	},

	devices: {
		leapmotion: {driver: 'leapmotion', connection: 'leapmotion'},
		sphero: {driver: 'sphero', connection: 'sphero'}
	},

	work: function(my){
		my.leapmotion.on('frame', function(frame){
			if(frame.valid && frame.gestures.length > 0){
				frame.gestures.forEach(function(g){
					if(g.type == 'swipe'){
						var currentPosition = g.position;
						var startPosition = g.startPosition;

						var xDirection = currentPosition[0] - startPosition[0];
						var yDirection = currentPosition[1] - startPosition[1];
						var zDirection = currentPosition[2] - startPosition[2];

						var xAxis = Math.abs(xDirection);
						var yAxis = Math.abs(yDirection);
						var zAxis = Math.abs(zDirection);

						var superiorPosition  = Math.max(xAxis, yAxis, zAxis);

						if(superiorPosition === xAxis){
							if(xDirection < 0){
								my.sphero.roll(70, 270, 1);
								console.log('LEFT');
							} else {
								my.sphero.roll(70, 90, 1);
								console.log('RIGHT');
							}
						}

						if(superiorPosition === zAxis){
							if(zDirection > 0){
								console.log('BACKWARDS');
								my.sphero.roll(70, 180, 1);
							} else {
								console.log('FORWARD');
								my.sphero.roll(70, 0, 1);
							}
						}

						if(superiorPosition === yAxis){
							if(yDirection > 0){
								console.log('UP');
								my.sphero.roll(0,0,0);
							} else {
								console.log('DOWN');
								my.sphero.roll(0,0,0);
							}
						}
					}
				})
			}
		})
	}
}).start();