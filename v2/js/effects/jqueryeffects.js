define(['jquery', 'global', 'step1'], function($, global, step1){
	
			$.fn.getTooltip = function(){
				
				return $(this).closest(step1.FormItem).find(global.ToolTip);
				
			};

			$.fn.animateBg = function(hex, time) {
				var start = [255, 255, 255];
				var end = [Hex2RGB(hex, 1.0)[0], Hex2RGB(hex, 1.0)[1], Hex2RGB(hex, 1.0)[2]];
				
				//$(this).fadeOut();
				$(this).animate( {'aaa': 1}, {duration: time, step: function(now){
					
				$(this).css('background-color', 'rgb('+
					parseInt(start[0] + (end[0]-start[0]) * now) + ',' +
					parseInt(start[1] + (end[1]-start[1]) * now) + ',' +
					parseInt(start[2] + (end[2]-start[2]) * now) + ')');
					
				}, complete: function(){$(this).css('aaa', 0)}} )
			}; 
			
			$.fn.shake = function(interval,distance,times){
			   interval = typeof interval == "undefined" ? 100 : interval;
			   distance = typeof distance == "undefined" ? 10 : distance;
			   times = typeof times == "undefined" ? 3 : times;
			   var jTarget = $(this);
			   jTarget.css('position','relative');
			   for(var iter=0;iter<(times+1);iter++){
				  jTarget.animate({ left: ((iter%2==0 ? distance : distance*-1))}, interval);
			   }
			   return jTarget.animate({ left: 0},interval);
			}
			
			var Hex2RGB = function(hex, opacity) {
				var h=hex.replace('#', '');
				h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

				for(var i=0; i<h.length; i++)
					h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

				if (typeof opacity != 'undefined')  h.push(opacity);

				
			   // return 'rgba('+h.join(',')+')';
			   return h;
			}
			
			var GetToolTip = function(div){
				return div.getTooltip();
			}
			
			var AnimateBg = function(div, hex, time){
				return div.animateBg(hex, time);
			}
			
			var Shake = function(div, interval, distance, times){
				return div.shake(interval, distance, times);
			}
			
			return{
			GetToolTip: GetToolTip,
			AnimateBg: AnimateBg,
			Shake: Shake,
			Hex2RGB: Hex2RGB,
			}
});		