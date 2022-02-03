define(['jquery', 'registeringUser'], function($, registeringUser){		

			var Initiated = false;
			var SpawnOption = $('.sOption');
			var ValidSpawnAreas = [
				59,
				1
			];
			
			var ChooseSpawnOption = function(Div){
				
				var SpawnId = Div.attr('spawnid');
				SpawnOption.not(Div).removeClass('optionClicked');	
				Div.addClass('optionClicked');
				
				window.NewUser.SpawnArea = parseInt(SpawnId);
			}
			
			var ValidSpawnId = function(spawnId){
				
				if(jQuery.inArray(spawnId, ValidSpawnAreas) <= -1)
				{
					return false;
				}
				
				return true;
			}
			
			var Continue = function(){
				
				
				if(!ValidSpawnId(window.NewUser.SpawnArea))
				{
					alert('Your IP has been logged for trying to exploit the system!');
					return;
				}
				
				window.NewUser.finaliseRegistration();
				
			}
			
			
			var Initiate = function(){
				SpawnOption.first().click();
			}
			
		return{
			
			Initiate: Initiate,
			Initiated: Initiated,
			Continue: Continue,
			
			ChooseSpawnOption: ChooseSpawnOption,
			SpawnOption: SpawnOption,
			
		}
		
		
});	