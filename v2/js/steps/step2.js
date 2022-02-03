define(['jquery', 'registeringUser'], function($, registeringUser){		

			var Initiated = false;
			var ClassBtn = $('.classBtn');
			var ClassBody = $('#classBody');
			var ClassChosen = "civilian";
			var ValidClasses = [
				'civilian',
				'gunner',
				'fighter'
			]
			
			var LoadClass = function(Actual, ClassBtn, Class){
				ClassChosen = Class;
				ClassBtn.not(Actual).removeClass('classClicked');	
				$(Actual).addClass('classClicked');
				
				ClassBtn.each(function( index ) {
						if($(this).text().toLowerCase() != Class)
						{
							$('.' + $(this).text().toLowerCase()).stop().fadeOut(0);
						}
				});			
					
				var div = $('.' + Class).stop().fadeIn(250);
				window.NewUser.setDetails("class", ClassChosen);
			}	
			
			var ValidClass = function(classname){
				
				if(jQuery.inArray(classname, ValidClasses) <= -1)
				{
					return false;
				}
				
				return true;
			}
			
			var StepTwoVariables = {
				
			}
				
			var Continue = function(){
				require(['global'], function(global){
					
					if(!ValidClass(window.NewUser.RPClass))
					{
						alert('Your IP has been logged for trying to exploit the system!');
						return;
					}
					
					
					window.NewUser.proceedStep();
				});
			}
			
			
			var Initiate = function(){
				LoadClass(ClassBtn.first(), ClassBtn, 'civilian');
			}
			
		return{
			
			StepTwoVariables: StepTwoVariables,
			Initiate: Initiate,
			Initiated: Initiated,
			Continue: Continue,
			LoadClass: LoadClass,
			ClassBtn: ClassBtn,
		}
		
		
});	