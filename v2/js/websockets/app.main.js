var app = {
	
	startedSocket: false,
	debugMode: false,
	
	webSocket: null,
	reconnectionInterval: null,
	pingInterval: null,
	
	host: null, 
	port: null,
	
	healthCycler: null,
	
	walking: false,
	walkingInterval: null,
	
		
	CaptchaBox: $('#captcha-box'),
	CaptchaBoxNotif: $('.captcha-box-notif'),
	InputBox: $('.captcha-box-input'),
	ErrorBox: $('.captcha-box-status'),
	SuccessTick: $('.captcha-box-success'),
	processCaptcha: null,
	checkSeconds: 2,
	curSeconds: 0,
	
    /**
     *
     * Initializes all components within the application.
     *
     * @property {function} initialize.
     */	 
    initialize: function(myID, myUsername, myFigure) {
        
        user = new User(myID, myUsername, myFigure);	
		
        user.id = myID;
		user.name = myUsername;
		user.figure = myFigure;
	
		app['host'] = flashvars['connection.socket.host'];
		app['port'] = flashvars['connection.socket.port'];
		
        app['bindEvents']();
        app['initSockets']();
    },
	 /**
	 *
	 * Binds the WebSocket Events (clicks, and such)
	 *
	 * @property {function} bindEvents.
	 */
    bindEvents: function() {

	
        // INITALIZE UR JQUERY EVENTS HERE LIKE .CLICK AND STUFF.
		
		app['bindATM']();
		app['bindCaptchaBox']();
	
	},
	
	/**
     *
     * Sends data to the users WebSocket
     *
     * @property {function} sendData.
     */
	sendData: function(event, data, bypass, json){
		if(typeof app['webSocket'] == undefined)
			return;
		
		if(app['startedSocket'] == false || app['webSocket'] == null)
		{
			console.log('[WEBSOCKET] Failed to send data as socket is not running!');
			return;
		}
		
		if(app['debugMode'])
		{
			console.log('sent data:::\n\n');
			var ap = "---------------------------------------------\n";
			ap += "Data Type: " + ( (app['isJSONData'](data)) ? "json" : "split_text") + "\n";
			ap += "Data contents: " + ( (app['isJSONData'](data)) ? JSON.stringify(JSON.parse(data)) : data) + "\n";
			ap += "---------------------------------------------\n\n"
			console.log(ap);
		}

		bypass = typeof bypass === 'undefined' ? false : bypass;
		
		app['webSocket'].send(JSON.stringify({		
			UserId: user.id, 
			EventName: event, 
			Bypass: bypass, 
			ExtraData: data,	
			JSON: json,
		}));	
	},
	
	isJSONData: function(data){
		try {
			JSON.parse(data);
		} catch (e) {
			return false;
		}
		return true;
	},
	
	/**
     *
     * Tests the WebSocket component within the application.
     *
     * @property {function} testSockets.
     */
	testSockets: function() {
		
	},
	
	/**
     *
     * Attempts to reconnect to websocket
     *
     * @property {function} tryReconnect.
     */
	tryReconnect: function () {
		
		console.log('[WEBSOCKET] Attempting to reconnect to WEBSOCKET..');
		app['webSocket'].close();
		app['webSocket'] = null;
		app['initSockets']();
		
	},
	
    /**
     *
     * Initializes the WebSocket component within the application.
     *
     * @property {function} initSockets.
     */
    initSockets: function() {
		
		clearInterval(app['reconnectionInterval']);
		clearInterval(app['pingInterval']);
	 
		var path = 'ws://' + app['host'] + ':' + app['port'] + '/' + user.id;
		
		if(typeof(WebSocket) == undefined)
			$('#sstatus').css('color', 'yellow').html('Please use a newer browser!');	
		else
			app['webSocket'] = new WebSocket(path);
		
        app['webSocket'].onopen = function() {	
			$('#sstatus').css('color', 'green').html('Connected!');		
			app['startedSocket'] = true;
			app['fetchStatistics']();
			
			app['pingInterval'] = setInterval(function() {
				app['sendData']('event_pong', '', true, false);
			}, 30000);

			console.log("[WEBSOCKET] Successfully established WEBSOCKET connection");	
        };
		
		app['webSocket'].onclose = function () {
			$('#sstatus').css('color', 'red').html('Disconnected!');					
			 clearInterval(app['pingInterval']);
			 console.log('[WEBSOCKET] Disconnected from WEBSOCKET..');
			 app['startedSocket'] = false;
			 app['webSocket'].close();
			 
			 app['reconnectionInterval'] = setInterval(app['tryReconnect'], 2500);	
			 return;
		}
		
		app['webSocket'].onerror = function(event) {		
            console.log("[WEBSOCKET] Websocket error " + JSON.stringify(event));
        };

        app['webSocket'].onmessage = function(event) {
			
			
			if(app['debugMode'])
			{
				console.log('received data:::\n\n');
				var ap = "---------------------------------------------\n";
				ap += "Data Type: " + ( (app['isJSONData'](event.data)) ? "json" : "split_text") + "\n";
				ap += "Data contents: " + ( (app['isJSONData'](event.data)) ? JSON.stringify(JSON.parse(event.data)) : event.data) + "\n";
				ap += "---------------------------------------------\n\n"
				console.log(ap);
			}
		
			if(app['isJSONData'](event.data))
			{			
				var jsonObj = JSON.parse(event.data);
		
				switch(jsonObj.event){
					case "chatManager":
					if(user.chatMgr != null)
						user.chatMgr.handleData(jsonObj);
					break;
					default:
						return;
					break;
				}
				return;
			}
			
			
			
			var eventData = event.data.split(':');
			var eventName = jQuery.trim(eventData[0]);
			var extraData = eventData[1];
				
			switch (eventName) {

				case 'compose_jsalert': {
					alert(extraData);
					break;
				}
				
				case 'compose_newonlinecount': {
					
					var count = eventData[1];
					
					$('#userson').fadeOut(500, function(){
						$('#userson').html(count).fadeIn(50);
					});
					
					break;
				}
				
				case 'compose_arrowmovement': {
					
					var enable = eventData[1];
					
					if(enable == 'yes')
					{
						app['bindWalking']();
					}
					else
					{
						app['unbindWalking']();
					}
					
					break;
				}
				
				case 'compose_ping': {
					
					console.log('[WEBSOCKET] Awaiting websocket data...');
					break;
				}
				
				case 'compose_characterbar': {
					app['loadStatistics'](extraData);
					break;
				}
				
				case 'compose_clear_characterbar': {
					app['loadStatistics'](extraData, true);
				}
				
				case "compose_atm": {
					
					var Action = jQuery.trim(extraData);
					var UserData = (jQuery.trim(eventData[2])).split(',');
					var HasBank = (UserData[0] == "1" ? true : false);
					var ChequingsBalance = UserData[1];
					var SavingsBalance = UserData[2];					
		
		
					switch(Action)
					{
						case "open":
							$('#ActivityOverlay').show();
							$('#AtmMachine').addClass('oAtmMachine').show();
							$('.c_amt').html(ChequingsBalance);
							$('.s_amt').html(SavingsBalance);						
						break;
						case "error":
							var Error = eventData[2];
							$('#AtmCloseBtn').html('<div class="AtmError" style="position:absolute;top: -1028%;left: -222%;font-size: 10px;color: white;width: 300px;background: #aa7200;height: 10px;font-weight: bold;text-align: center;border: 2px solid #ffdd00;padding: 5px;line-height: 10px;border-radius: 2px;">' + Error + '</div>');
						break;	
						case "change_balance_1":
							var Amount = eventData[2];
							$('.c_amt').html(Amount);
						break;
						case "change_balance_2":
							var Amount = eventData[2];
							$('.s_amt').html(Amount);
						break;
						default:
							//alert(Action);
						break;
					}				
					break;
				}
					
				case "compose_htmlpage": {
				
					var page = (event.data.split(',')[0]).split(':')[1];
					var action = (event.data.split(',')[1]).split(':')[1];
					
					$.ajax({
						type: "POST",
						url: "/resources-ajax/settings/" + page + ".php",
						cache: false,
						data: {
							
						}	
					}).done(function(data) {
						$('.PageElement').html(data);
					});				
					break;
				}
				
				case "compose_timer": {
					
					var Timer = (event.data.split(',')[0]).split(':')[1];
					var Action = (event.data.split(',')[1]).split(':')[1];
					var Value = (event.data.split(',')[2]).split(':')[1];
					
					var DisplayName = Timer.split('-')[0] + " " + Timer.split('-')[1];
					var TimerDialogue = $('.' + Timer.split('-')[0].toLowerCase() + "" + Timer.split('-')[1].toLowerCase());
					
					switch(Action)
					{
						case "add":
						
							TimerDialogue.html(DisplayName + ': ' + Value).fadeIn();
							
						break;
						
						case "remove":
							
							TimerDialogue.fadeOut();
						
						break;
						
						case "decrement":
							
							TimerDialogue.html(DisplayName + ': ' + Value);
						
						break;
					}
					
					break;
				}		
				
				case "compose_captchabox": {
					
					var captchaData = extraData;
					var captchaParts = captchaData.split(',');
					
					var Title = captchaParts[1];
					var GeneratedString = captchaParts[2];
					
										
					
					app['CaptchaBox'].fadeIn();
					$('.captcha-box-information').fadeOut().html(Title).fadeIn();
					$('.captcha-box-generatedtxt').fadeOut().text(GeneratedString).fadeIn();
					
				}
				
				case "compose_chat": {

					user.chatMgr.handleData(event.data);
					
					break;
				}
				
				default: { 
					console.log('Unable to get event using the specified name: ' + JSON.stringify(event));
				break;
				}

			}
        };
      
		
   },
	
	unbindWalking: function() {
		$(document).unbind('keydown');
		$(document).unbind('keyup');
	},
	
	bindWalking: function() {
		
		
		$(document).keydown(function(e) {
			
			app['walking'] = true;
			clearTimeout(app['walkingInterval']);
			
			var key = "";
			
			switch(e.which) {
				case 37: 
					key = "Left";
				break;

				case 38:
					key = "Up";
				break;

				case 39:
					key = "Right";
				break;

				case 40:
					key = "Down";
				break;

				default: return;
			}
			
			if(key == "")
				return;
			
			
			app['sendData']('event_walk', key, false, false);
			app['walking'] = true;
			
			
		}).keyup(function(){
			
			app['walking'] = false;
			
			app['walkingInterval'] = setTimeout(function(){
				
				if(app['walking'] == true)
					return;
				
				app['sendData']('event_walk', "stop", false, false);
				
			}, 500);	
		});
		
	},

	bindATM: function () {
				
		$('#AtmCloseBtn').on('click', function(){
			$('#ActivityOverlay').hide();
			$('#AtmMachine').hide();
		});

		$('.deposit').on('click', function(){
			$('.AtmHomeScreen').fadeOut(function(){
				$('.AtmDepositScreen').fadeIn();
			});
		});
	
		$('.withdraw').on('click', function(){
			$('.AtmHomeScreen').fadeOut(function(){
				$('.AtmWithdrawScreen').fadeIn();
			});
		});
		
		$('.atmback').on('click', function(){
			$('.AtmWithdrawScreen, .AtmDepositScreen').fadeOut(function(){
				$('.AtmHomeScreen').fadeIn();
			});
		});	
		
		$('.deposit_submit').on('click', function(){
			var depositAmount = parseInt($('input[class=deposit_amount]').val());
			var account_type = $('select[class=deposit_acc]').val();			
			var data = 'deposit,' + depositAmount + "," + account_type;
			
			app['sendData']('event_atm', data, false, false);
			
		});
		
		$('.withdraw_submit').on('click', function(){			
			var withdrawAmount = parseInt($('input[class=withdraw_amount]').val());
			var account_type = $('select[class=withdraw_acc]').val();
			var data = 'withdraw,' + withdrawAmount + "," + account_type;
			
			app['sendData']('event_atm', data, false, false);
			
		});
	
	},
	
	bindCaptchaBox: function () {	
		
	function composeCaptchaError(error){
		app['ErrorBox'].html(error).slideDown(500);
		
		app['InputBox'].animate({borderColor:'#fb6d6d !important',},1000);
		app['CaptchaBox'].animate({borderColor:'#fb6d6d !important',},1000);
		app['CaptchaBoxNotif'].animate({borderColor:'#fb6d6d !important',},1000);
	}
	
	function composeCaptchaSuccess(){
		app['ErrorBox'].slideUp(500);
		
		app['SuccessTick'].fadeIn(200);
		
		app['InputBox'].animate({borderColor:'#87bd83 !important',},1000);
		app['CaptchaBox'].animate({borderColor:'#87bd83 !important',},1000);
		app['CaptchaBoxNotif'].animate({borderColor:'#87bd83 !important',},1000);
	}
	
	function resetCaptchaBox()
	{
		setTimeout(function(){	
			app['CaptchaBox'].fadeOut();		
			app['ErrorBox'].slideUp();	
			app['SuccessTick'].fadeOut();
			app['InputBox'].animate({borderColor:'#ffb91d !important',},1000);
			app['CaptchaBox'].animate({borderColor:'rgba(174, 174, 174, 0.4) !important',},1000);
			app['CaptchaBoxNotif'].animate({borderColor:'rgba(174, 174, 174, 0.4) !important',},1000);
			app['SuccessTick'].fadeOut();	
			app['InputBox'].val("");
		},2000);		
	}	
		app['InputBox'].on('keydown', function(){	
		
			if( app['SuccessTick'].is(':visible') || !(app['CaptchaBox'].is(':visible')) )
				return;
				
			if(app['processCaptcha'] == null)
			{
				
				app['processCaptcha']  = setInterval(function(){

					if(app['curSeconds'] < app['checkSeconds'])
					{
						app['curSeconds']++;
					}
					else
					{	
						var Title = $('.captcha-box-information').text();
						
						if( ( jQuery.trim($('.captcha-box-generatedtxt').text()).toLowerCase() != jQuery.trim($('.captcha-box-input').val()).toLowerCase() ) )
						{
							clearInterval(app['processCaptcha']);
							app['processCaptcha'] = null;
							
							app['sendData']('event_captcha', 'regenerate,' + Title, false, false);
							composeCaptchaError("Incorrect. Try again!");
							
							app['curSeconds'] = 0;
							
					
						}
						else
						{
							
							clearInterval(app['processCaptcha']);	
							app['processCaptcha'] = null;
							
							composeCaptchaSuccess();
							app['sendData']('event_captcha', 'complete,' + Title, false, false);
							
							resetCaptchaBox();																	
							app['curSeconds'] = 0;
							
							
							return;
						}
					}
					
				},1000);
			}
			
			app['curSeconds'] = 0;
			
		});
			
	},
	
	fetchStatistics: function(){
		
		app['sendData']('event_retrieveconnectingstatistics', '', true, false);
		
	},

	loadStatistics: function(usersdata, clear){
		
		clear = typeof clear === 'undefined' ? false : clear;
		
		if(!clear)
		{
			var DataParts = usersdata.split(',');
			
			var UserID = parseInt(DataParts[0]);
			var UsersFigure = DataParts[1];
			var CurHealth = parseInt(DataParts[2]);
			var MaxHealth = parseInt(DataParts[3]);
			var CurEnergy = parseInt(DataParts[4]);
			var MaxEnergy = parseInt(DataParts[5]);
			var CurXP = parseInt(DataParts[6]);
			var NeedXP = parseInt(DataParts[7]);
			var Level = parseInt(DataParts[8]);
			
			if(CurHealth > MaxHealth)
				CurHealth = MaxHealth;
			
			if(CurEnergy > MaxEnergy)
				CurEnergy = MaxEnergy;
			
			if(CurXP > NeedXP)
				CurXP = NeedXP;
	
			var calculatedHP = Math.ceil((((CurHealth / MaxHealth)) ) * 108);
			var calculatedEnergy = Math.ceil((((CurEnergy / MaxEnergy)) ) * 108);
			var calculatedXP = Math.ceil((((CurXP / NeedXP)) ) * 56);
			
			var figure = "https://www.habbo.com/habbo-imaging/avatarimage?figure=" + UsersFigure + "&gesture=srp&head_direction=3&headonly=1";
			
			
			if(UserID == user.id)
			{
				// THATS ME
				
				// Health bar SETTER
				var HealthBar = $('.1').find('.HealthBar');
				var HealthValue = HealthBar.css('width');
				
				// Energy Bar SETTER
				var EnergyBar = $('.1').find('.EnergyBar');
				var EnergyValue = EnergyBar.css('width');
				
				// XP Bar SETTER
				var XPBar = $('.1').find('.XPBar');
				var XPValue = XPBar.css('width');
				
				// Character Figure
				var CharacterDiv = $('.1').find('.Character');
				var CharacterValue = CharacterDiv.css('background');
				var NewCharacterValue = null;
				
				if(NewCharacterValue == null)
				{
					CharacterDiv.css({background: 'url(' + figure + ')'});
					NewCharacterValue = figure;
				}
				
				if(NewCharacterValue != figure)
				{
					$('.1').fadeOut();
					CharacterDiv.css({background: 'url(' + figure + ')'});
					NewCharacterValue = figure;
				}
				
				// Update Health Bar Width
				if((calculatedHP + 'px') != HealthValue)
				HealthBar.stop().animate({queue: false, width: calculatedHP + 'px'});
				
				// Update Energy Bar Width
				if((calculatedEnergy + 'px') != EnergyValue)
				EnergyBar.stop().animate({queue: false, width: calculatedEnergy + 'px'});
			
				// Update XP Bar Width
				if((calculatedXP + 'px') != XPValue)
				XPBar.stop().animate({queue: false, width: calculatedXP + 'px'});
			
			
				$('.1').find('.LevelIndicator').html("" + Level);
				
				// Fade in stats bar if not present
				$('.1').fadeIn();
			}
			else
			{
				var HealthBar = $('.2').find('.HealthBar');
				var HealthValue = HealthBar.css('width');
				
				var EnergyBar = $('.2').find('.EnergyBar');
				var EnergyValue = EnergyBar.css('width');
				
				var CharacterDiv = $('.2').find('.Character');
				var CharacterValue = CharacterDiv.css('background');
				
				
				if(jQuery.trim(CharacterValue.toLowerCase()).indexOf(figure) <= -1)
				{
					$('.2').fadeOut(200,function(){
						CharacterDiv.css({background: 'url(' + figure + ')'});
						NewCharacterValue = figure;
					});
				}
				
				if((calculatedHP + 'px') != HealthValue)
				HealthBar.animate({width: calculatedHP + 'px'});
				
				if((calculatedEnergy + 'px') != EnergyValue)
				EnergyBar.animate({width: calculatedEnergy + 'px'});
				
				$('.2').find('.LevelIndicator').html("" + Level).fadeIn();
				
				$('.2').fadeIn();
				
			}
		}
		else
		{
			$('.2').fadeOut();
		}
	},
	 
};