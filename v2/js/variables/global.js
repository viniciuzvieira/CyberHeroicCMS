define(['jquery', 'bottom', 'step1'], function($, bottomJs, step1){	

		window.NewUser;
		var CoolDown = 0;
		var Step = 1;
		var ToolTip = $('.tooltipExample');
		var Continue = $('.continueBtn');
		var Back = $('.backBtn');
		var StepText = $('.stepText');
		var MainContainer = $('#containerContent');	
		var Div = $('div');

		
		Continue.on('click',function(){		
			require(['step' + window.NewUser.Step ],function(step){
				
				console.log('continuing');
				
				step.Continue();
				
			});		
		});
		
		Back.on('click', function(){
			window.NewUser.receedStep( ( ( (window.NewUser.Step - 1) <= 0 || (window.NewUser.Step - 1) > 4  ) ? 1 : window.NewUser.Step - 1) );
		});
					
		return {
			Step: Step,
			ToolTip: ToolTip,
			Continue: Continue,
			Back: Back,
			StepText: StepText,
			MainContainer: MainContainer,
			Div: Div			
		}
		
		
	
});