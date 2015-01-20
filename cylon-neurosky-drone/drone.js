var Cylon = require('cylon');

Cylon.robot({
	connections: {
		neurosky: {adaptor: 'neurosky', port: '/dev/tty.MindWaveMobile-DevA'},
		ardrone: { adaptor: 'ardrone', port: '192.168.1.1' }
	},

	devices: {
		headset: {driver: 'neurosky', connection: 'neurosky'},
		drone: {driver: 'ardrone', connection: 'ardrone'}
	},

	work: function(my){
		my.headset.on('attention', function(data){
			console.log('attention: ' + data);
			if(data > 50){
				my.drone.takeoff();
				after((6).seconds(), function(){
					my.drone.land();
				});
			}
		});
	}
}).start();
