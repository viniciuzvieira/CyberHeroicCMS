define(['jquery'], function($){
		
		var RegistratingUser = function(){	
		
			this.Step = 1;
			this.Registered = false;
			
			this.Gender;
			this.Username;
			this.Firstname;
			this.Lastname;
			this.Password;
			this.RPassword;
			this.Email;
			this.RPClass;	
			this.Figure;
			this.SpawnArea;
			
		};	
			
		RegistratingUser.prototype.startStep = function(step, Back) {
			
						
			this.Step = step;
			
			try
			{
			if(step <= 0)
			{
				
			}
			else
			{
				
			
				require(['global'], function(globalJs) {
					
					if(Back)
					{
						if(step - 1 >= 0)
						{
							var PrevStep = step + 1;
							require(['step' + ((PrevStep <= 0 || PrevStep > 4 ) ? 1 : PrevStep)], function(previousStep){	
								console.log('De-initiated Step ' + PrevStep);
								previousStep.Initiated = false;
							});
						}
					}
					else
					{
					if(step - 1 >= 1)
					{
						
						var PrevStep = step - 1;
						require(['step' + ((PrevStep <= 0 || PrevStep > 4 ) ? 1 : PrevStep)], function(previousStep){	
							console.log('De-initiated Step ' + PrevStep);
							previousStep.Initiated = false;
						});
					}
					}
					
					switch(parseInt(step))
					{
						case 1:
							globalJs.StepText.fadeOut().html('Welcome to HoloRP!').fadeIn(200, function(){
								
								$('.loadingDiv').fadeOut();
								
							});
						break;
						case 2:
							globalJs.StepText.fadeOut().html("Your character type will dictate what kind of path you will follow, so choose wisely!").fadeIn(200);
						break;
						case 3:
							globalJs.StepText.fadeOut().html('Gotta look pretty for all the pretty men and women, whatever you\'re into!').fadeIn(200);
						break;
						case 4:
							globalJs.StepText.fadeOut().html('Ok, lets prepare to play!').fadeIn(200);
						break;
					}
				
				
					require(['step' + ((step <= 0 || step > 4) ? 1 : step)], function(Thestep){	
						
						var StepDiv = $('.step' + step);
						var OtherDivs = $('.step');
						OtherDivs.stop();
						if(!Thestep.Initiated)
						{								
								//alert();
								console.log('Initiated Step ' + step);
								Thestep.Initiated = true;
								Thestep.Initiate();
								
								OtherDivs.not(StepDiv).stop().fadeOut(10,function(){
									StepDiv.fadeIn(1000, function(){
										
									});
								});
						}
						
					});			
					
			});	
			
			}
			}
			catch(Err)
			{
				console.log('Error occured!');
			}
		};
		
		RegistratingUser.prototype.setDetails = function(detail, value){
			
			//alert('setting: ' + detail + ' to ' + value);
			
			switch(detail)
			{
				case "username":
				case "reg_username":
					this.Username  = value;
				break;
				case "firstname":
					this.Firstname = value;
				break;
				
				case "lastname":
					this.Lastname = value;
				break;
				
				case "password":
				case "reg_password":
					this.Password = value;
				break;
				
				case "rpassword":
				case "reg_rpassword":
					this.RPassword = value;
				break;
				
				case "email":
				case "reg_email":
					this.Email = value;
				break;
				
				case "gender":
				case "reg_gender":
					this.Gender = value;
				break;
				
				case "figure":
				case "reg_figure":
					this.Figure = value;
				break;
				
				case "class":
				case "rpclass":
				case "reg_class":
					this.RPClass = value;
				break;
			}
		}

		RegistratingUser.prototype.proceedStep = function(){
			
			
			this.Step++;
			//alert(this.Step);
			this.startStep(this.Step, false);
			
		}
		
		RegistratingUser.prototype.receedStep = function(step){
			
			this.Step = step;
			this.startStep(this.Step, true);
	
			
		}
		
		RegistratingUser.prototype.finaliseRegistration = function(){
			
			if(!this.Registered)
			{
				
				
				var DataSend = {
					'gender' :  this.Gender,
					'username' : this.Username,
					'password' : this.Password,
					'rpassword' : this.RPassword,
					'email' : this.Email,
					'class' : this.RPClass,
					'figure' : this.Figure,
					'spawnarea' : this.SpawnArea
				}
				
				$.ajax({
					type: "POST",
						url: "/register-ajax/registerfinalisation.php",
						cache: false,
						data: {					
							finished: true,
							data: DataSend
						}	
				}).done(function(data){
					
					//echo $cleanedUsername . ':' . $SpawnArea . ':' . $Figure . ':' . $cleanedClass;
					
					var parts = data.split(':');
					var Username = parts[0];
					var SpawnArea = parts[1];
					var Figure = parts[2];
					var Class = parts[3];
					
					$('#mainContainer').html('<div id="welcomeMsg"></div>').animate({
							width: '900px'
						},500, function(){
							
							$('#welcomeMsg').fadeIn();
							$('#welcomeMsg').html(((($('#welcomeText').html().replace("{username}",Username)).replace("{spawnarea}", SpawnArea)).replace("{figure}", Figure)).replace("{class}", Class));
							setTimeout(function(){
								
								window.location.href = 'http://holorp.com/';
								
							},10000);
						});
						
					if(data == 'Finished')
					{
						
					}
					
					this.Registered = true;
				});
			}
			
		};
		
		return {
			CreateNewUser: new RegistratingUser(),
		}
		
});