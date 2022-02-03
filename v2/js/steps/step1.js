define(['jquery', 'registeringUser'], function($, registeringUser){		

			var Initiated = false;
			
			var InputBoxes = $('input');
			var FormItem = $('.formItem');
			var UsernameBox = $('input[name=reg_username]');
			var PasswordBox = $('input[name=reg_password]');
			var RPasswordBox = $('input[name=reg_rpassword]');
			var EmailBox = $('input[name=reg_email]');
			var PwStrength = 0;
			var FormError = $('#formError');	
			
			var StepOneVariables = {
					
					'reg_username' : {
						'value' : UsernameBox.val(),
						'id' : 1,
						'isset' : 'no',
						'valid' : 'no'
						
					},
						
					'reg_password' : {
						'value' : PasswordBox.val(), 
						'id' : 2,
						'isset' : 'no',
						'valid' : 'no'
						
					},
						
					'reg_rpassword' : {
						'value' : RPasswordBox.val(), 
						'id' : 3,
						'isset' : 'no',
						'valid' : 'no'
						
					},
					
					'reg_email' : {
						'value' : EmailBox.val(), 
						'id' : 4,
						'isset' : 'no',
						'valid' : 'no'
						
					}
					
			}
			
			var Continue = function(){
				$.ajax({
					type: "POST",
					url: "/register-ajax/registerstep1validation.php",
					dataType: "json",
					data: {					
						reg_begin: true,
						reg_values: StepOneVariables				
					}				
				}).done(function(data) {				
					var error = data.error.isset;
					var success = !error;				
					if (error)
					{	
						require(['jeffects'], function(jeffects){
						$.each(data, function(index, item) {	
						
							if(data[index]["index"] == 'error' || data[index]["index"] == undefined) return true;				
							var data_name = data[index]["index"];
							var data_id = data[index]["id"];
							var data_set = data[index]["isset"];
							var data_valid = data[index]["valid"];
							var data_value = data[index]["value"];
							var data_taken = data[index]["taken"];
							
							var Itemdiv = $('input[name=' + data_name +  ']');		
							var ToolTip = jeffects.GetToolTip(Itemdiv);
							var AnimateError = function(){
							   jeffects.AnimateBg(Itemdiv,'#F98888', 250);
							   jeffects.Shake(Itemdiv, 100, 10, 3);
							}
							
							if (data_set == 'no')
							{									
								AnimateError();
								$.ajax({type: "GET", url: "/register-ajax/registererrors.php", data:{errordata_name: data_name}}).done(function(data){								
									
									if(ToolTip.hasClass('tooltipSuccess'));
										ToolTip.removeClass('tooltipSuccess');
										
									ToolTip.addClass('tooltipError').html(data).fadeIn(500);
									
								});								
								return true;
							}						
							
							if (data_valid == 'no')
							{
								AnimateError();							
								$.ajax({type: "GET", url: "/register-ajax/registererrors.php", data:{validdata_name: data_name}}).done(function(data){
									if(Itemdiv.getTooltip().hasClass('tooltipSuccess')) Itemdiv.getTooltip().removeClass('tooltipSuccess')								
									Itemdiv.getTooltip().addClass('tooltipError').html(data).fadeIn(500);			
								});							
								return true;
							}	
							
							if (data_taken != undefined)
							{
								AnimateError();							
								$.ajax({type: "GET", url: "/register-ajax/registererrors.php", data:{takendata_name: data_name}}).done(function(data){
									if(Itemdiv.getTooltip().hasClass('tooltipSuccess')) Itemdiv.getTooltip().removeClass('tooltipSuccess')								
									Itemdiv.getTooltip().addClass('tooltipError').html(data).fadeIn(500);			
								});							
								return true;
							}
							
							$.ajax({type: "GET", url: "/register-ajax/registererrors.php", data:{successdata_name: data_name}}).done(function(data){								
									if(ToolTip.hasClass('tooltipError')) 
										ToolTip.removeClass('tooltipError')
									ToolTip.addClass('tooltipSuccess').html(data).fadeIn(500);								
							});	
								
							jeffects.AnimateBg(Itemdiv,'#88F98F', 250);																							
						});
						});
					}
					else if(success)
					{
						
						require(['global'], function(global){
							$.each(data, function(index, item) {				
									if(data[index]["index"] == 'error' || data[index]["index"] == undefined) return true;
									
									var data_name = data[index]["index"];
									var data_id = data[index]["id"];
									var data_set = data[index]["isset"];
									var data_valid = data[index]["valid"];
									var data_value = data[index]["value"];
									
									
								window.NewUser.setDetails(data_name, data_value)
							
					
							});
						
							
							$('.youToolTip').animate({
								
								fontSize: '10px',
								opacity: '0.7',
								
							}).html('&#x2764');
							
							var name = window.NewUser.Username;
							var First = name.split('-')[0];
							var Last = name.split('-')[0];
							
							$('.youToolTip').html();
							
							window.NewUser.proceedStep();
							//require.undef(['step1']);
						});
					}
						
				}).fail(function(){

				});					
			}
			
			
			var Initiate = function() {
				require(['global'], function(global) {
					
				});
			}
			
		return {
			
			StepOneVariables: StepOneVariables,
			Initiate: Initiate,
			Initiated: Initiated,
			Continue: Continue,
			
			InputBoxes: InputBoxes,
			FormItem: FormItem,
			UsernameBox: UsernameBox,
			PasswordBox: PasswordBox,
			RPasswordBox: RPasswordBox,
			EmailBox: EmailBox,
			PwStrength: PwStrength,
			FormE: FormError,

		}
		
		
});	