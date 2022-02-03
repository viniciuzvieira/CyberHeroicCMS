define(['jquery', 'registeringUser'], function($, registeringUser){		

			var Initiated = false;
			var FigsLoaded = false;
			var FigureBack = $('.figureItemContainer');
			var GenderBtn = $('.gender');
			var GenderFiguresBox = $('.GenderFigures');
			var FigureChosen = "";
			var Habfigure = "http://www.habbo.com/habbo-imaging/avatarimage?figure=";
			var FemaleFigures = [
				'wa-3359-62.ch-3293-76-76.lg-3019-1198.cc-3397-73-82.hd-3100-8.hr-3273-39-40.ca-1816-62.sh-3184-1225',
				'wa-3264-1189-1189.hd-600-2.sh-3206-62.lg-3320-1189-1408.hr-9534-1404.he-3274-62.ch-665-1195',
				'wa-3264-110-110.cc-3289-73.he-3189-110.ca-3131-110-110.ha-8241-110-73.hr-3012-61.hd-628-10.lg-3023-110.ch-824-92',
				'wa-3263-64-62.cc-3008-1189-62.ea-3108-1189-1189.fa-3296-62.hd-600-8.he-3082-1193.ch-650-1229.lg-3057-1189.ca-3292-1216.hr-3012-34'
			];
			var MaleFigures = [
				'wa-3263-62-1408.hr-831-1395.ca-1816-62.cc-3087-62.sh-3252-92-1408.hd-180-8.lg-3202-92-1408.fa-1209-62.ch-210-92',
				'wa-3263-62-110.lg-3058-110.hr-3163-36.ch-3279-96.hd-209-1.ca-3217-110-1408.sh-3016-1198',
				'wa-3263-110-82.lg-3057-82.ch-210-96.hd-180-8.hr-3163-38.cc-3007-96-110.sh-3016-96',
				'wa-3212-110-110.sh-3089-110.ca-3187-96.ch-3022-96-96.fa-3276-100.hr-3194-1028-40.cc-3269-110-110.hd-180-10.lg-3057-110.ha-1011-110'
			];
			var Genders = [
				'male',
				'female'
			];
			
			var RefreshFigures = function(Gender)
			{			
			
				Habfigure = "http://www.habbo.com/habbo-imaging/avatarimage?figure=";
			
				FigureBack.each(function( index ) {
					
					var FigureLink = Habfigure + $(this).attr('gfigure');
					
					$(this).html("<div class='figureImg' style='background:url(\"" + FigureLink + "\")' ></div>");
					
				});	
				
				
				if(Gender == 'male')
				{
					var Figures = $('.' + Gender);				
					$('.female').fadeOut(function(){
						Figures.fadeIn(1200);
					});
				}
				else
				{
					var Figures = $('.' + Gender);				
					$('.male').fadeOut(function(){
						Figures.fadeIn(1200);
					});
				}
				
				if(!FigsLoaded)
				{
					FigsLoaded = true;
					LoadFigure(FigureBack.first(), FigureBack);
				}
			}			
			
			var ValidFigure = function(Figure)
			{
				
				require(['global'], function(global){
					
					var Gender = window.NewUser.Gender;
					
					if(Gender == 'male')
					{
						if(jQuery.inArray(Figure, MaleFigures) <= -1)
						{
							return false;
						}
					}
					else
					{
						if(jQuery.inArray(Figure, FemaleFigures) <= -1)
						{
							return false;
						}
					}
					
				});
				
				return true;
			}
			
			var ValidGender = function(Gender)
			{
				if(jQuery.inArray(Gender, Genders) <= -1)
				{
					return false;
				}
				
				return true;
			}
			
			var LoadFigure = function(Div, FigureBack)
			{
				var Figure = Div.attr('gfigure');
				
				FigureBack.not(Div).removeClass('figureItemContainerChosen');
				Div.addClass('figureItemContainerChosen');
				
				require(['global'], function(global){
					window.NewUser.setDetails("figure", Figure);
				});
				
				$('#figurePreview').fadeOut(500, function(){
					$(this).
					css({
						'background': 'url("' + Habfigure + "" + Figure + "&head_direction=3&direction=3&size=l" + '")'
					}).fadeIn(1200);
				});
				
			}	
			
			var ChooseGender = function(Div)
			{			
				var Gender = jQuery.trim(Div.attr('class').split('gender')[1]).toLowerCase();				

				require(['global'], function(global){
					
					if(Gender != window.NewUser.Gender)
					{
						var NewFigureGender = $('#first' + Gender);
						
						$('#figurePreview').fadeOut(500, function(){
							LoadFigure(NewFigureGender, FigureBack);
						});
					}
					
					window.NewUser.setDetails("gender", Gender);
				});
				
				GenderBtn.not(Div).removeClass('genderChosen');
				
				Div.addClass('genderChosen');
				
				RefreshFigures(Gender);
			}	
			
			
			require(['global'], function(global){
					window.NewUser.setDetails("gender", "male");
			});
			
			var StepTwoVariables = {
				
			}
				
			var Continue = function(){
				require(['global'], function(global){
					
					if(!ValidFigure(window.NewUser.Figure))
					{
						alert('Your IP has been logged for trying to exploit the system!');
						return;
					}
					
					window.NewUser.proceedStep();
					
				});	
			}
			
			
			var Initiate = function(){
				
				ChooseGender($('.genderMale'));
				
				require(['global'], function(global){
					
				});
			}
			
		return{
			
			StepTwoVariables: StepTwoVariables,
			Initiate: Initiate,
			Initiated: Initiated,
			Continue: Continue,
			
			ChooseGender: ChooseGender,
			FigureBack: FigureBack,
			LoadFigure: LoadFigure,
			GenderBtn: GenderBtn,
			
		}
		
		
});	