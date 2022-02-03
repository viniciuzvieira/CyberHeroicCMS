define(['jquery', 'global', 'jeffects'], function($, global, jeffects){		
		require(['step1'], function(step1) {
			step1.InputBoxes.on('focusin',function(){					
			var ToolTip = jeffects.GetToolTip($(this));
				if(!ToolTip.hasClass('tooltipError'))
				{
						type = $(this).attr('name');
						value = ToolTip.attr('value');					
						if(type != 'undefined' && value != 'undefined')
							ToolTip.html(value).fadeIn();	
				}
			}).focusout(function(){
				var ToolTip = jeffects.GetToolTip($(this));
			
				if(!ToolTip.hasClass('tooltipError'))
				{
						type = $(this).attr('name');		
						if(type != 'undefined')
							ToolTip.fadeOut();	
				}
			});	
			step1.InputBoxes.on('keyup', function(){
				var type = $(this).attr('name');
				var newvalue = $(this).val();
				step1.StepOneVariables[type] = {'value' : newvalue, 'valid' : 'no'};
			});						
		});	
		
		require(['step2'], function(step2) {
			step2.ClassBtn.on('click', function(){
				step2.LoadClass($(this), step2.ClassBtn, $(this).text().toLowerCase());
			});	
		});	
		
		require(['step3'], function(step3) {
			step3.FigureBack.on('click', function(){
				step3.LoadFigure($(this), step3.FigureBack);
			});	
			step3.GenderBtn.on('click', function(){
				step3.ChooseGender($(this));
			});
		});	
		
		require(['step4'], function(step4) {
			step4.SpawnOption.on('click', function(){
				step4.ChooseSpawnOption($(this));
			});
		});	
		
});