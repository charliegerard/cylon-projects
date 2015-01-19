var Cylon = require('cylon');

Cylon.robot({
	connections: {
		leapmotion: {adaptor: 'leapmotion'},
		ardrone: { adaptor: 'ardrone', port: '192.168.1.1' }
	},

	devices: {
		leapmotion: {driver: 'leapmotion', connection: 'leapmotion'},
		drone: {driver: 'ardrone', connection: 'ardrone'}
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
								console.log('LEFT');
								my.drone.left();
							} else {
								my.drone.right();
								console.log('RIGHT');
							}
						}

						if(superiorPosition === zAxis){
							if(zDirection > 0){
								console.log('BACKWARDS');
								my.drone.back();
							} else {
								console.log('FORWARD');
								my.drone.forward();
							}
						}

						if(superiorPosition === yAxis){
							if(yDirection > 0){
								console.log('UP');
								my.drone.up();
							} else {
								console.log('DOWN');
								my.drone.down();
							}
						}
					} else if(g.type === 'keyTap'){
						my.drone.backFlip();
						after((5).seconds(), function(){
							my.drone.land();
						})
					}
				})
			}
		})
	}
}).start();
