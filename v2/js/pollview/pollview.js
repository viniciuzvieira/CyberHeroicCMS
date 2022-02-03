
$.noConflict();
jQuery( document ).ready(function( $ ) {


var polltypeb = $('.polltypeb');
var polltype = "default";
var pollinfo = $('.pollinfo');
var pollreply = $('.pollreply');
var polltitle = $('#polltitle');

var daysc = $('input[name=orc]');
var inactivec = $('input[name=mor]');
var bannedc = $('input[name=bannedc]');
var save = $('.savechanges');
var showinactivec = $("input[name=sin]");


var max_show = 5;
var undisplay_show = 4;
var markinactive = true;
var markbanned = true;
var showinactive = true;
var oldresultsclassification = 20;

var polltitle = "";
var pollviewing = 0;
var pollpage = 1;

var CachedUsers = {};
var DisplayedUsers = {};
var CachedPoll = {};
var CachedPollsData = {};
var loadingresults = false;
var viewinguser = false;

var GlobalNInstance = null;
var GlobalPInstance = null;

save.on('click', function(){
	
	var m1 = inactivec.prop('checked');
	var m2 = bannedc.prop('checked');
	var sin = showinactivec.prop('checked');
	var days = daysc.val();
	
	markinactive = m1;
	markbanned = m2;
	showinactive = sin;
	viewinguser = false;
	
	oldresultsclassification = parseInt(days);
	getPollUsers(pollviewing);
	
	$('#successmsg').fadeOut(500,function(){
		
		$(this).html('Changes successfully applied!').fadeIn(200);
		
		
		setTimeout(function(){
			$('#successmsg').fadeOut(200);
		}, 5000);
		
	});

});


function MarkRead(pid, uid, name)
{
	$.ajax({
		type: 'GET',
		url: '/resources-ajax/polls/poll-info.php',
		data: {pollaction: 'markread', userid: uid, pollid: pid},
		cache: false,
		
	}).done(function(data){
		
		$('#' + name.toLowerCase()).fadeOut();
		
	});
}

function getPolls(type){

	$.ajax({
		type: 'GET',
		url: '/resources-ajax/polls/poll-info.php',
		data: {polltype: type},
		cache: false,
		
	}).done(function(data){
		
		pollinfo.html('');
		
		displayPoll(data);
		
	});
}

function getPoll(partdata){
	
	max_show = 5;
	undisplay_show = 4;
	pollpage = 1;
	loadingresults = false;
	
	CachedPollsData = {};
	CachedPoll = {};
	DisplayedUsers = {};
	CachedUsers = {};
	
	pollinfo.fadeOut(200, function(){
		
		$(this).html('');
		var info = "";
		
		var displayPer = [
			5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115
		]
		
		$('#polltitle').html(partdata['caption']);
		
		
		info += "<div style='margin-left:10% !important;'>";
		info += "<div class='loadless'>Load Previous Page</div>";
		info += "<div class='pagecount'>Page 1</div>"; 
		info += "<div class='loadmore'>Load Next Page</div>";
		info += "<select style='padding:3px;' class='perpage'>";
		$.each(displayPer, function(index, val){
			info += "<option>" + val + "</option>";
		});
		info += "</select></div>";
		info += "<hr style='margin-top:3%;margin-left:1%;'>";
		info += "";
		info += "<div class='polldata'></div>";
		
		var loaded=false;
		var max = 10;
		var cur=1;
		
		pollinfo.stop().html(info).fadeIn(200, function(){												
			$('.loadmore').on('click', displayMorePollUsers);
			$('.loadless').on('click', displayLessPollUsers);
			$('.perpage').on('change', function(){
				
				viewinguser = false;
				var num = parseInt($(this).val());
				max_show = num;
				undisplay_show = num - 1;
				pollpage = 1;
				getPollUsers(pollviewing);
				$('.pagecount').html('Page ' + pollpage);
			});
		});
		
		
		pollviewing = partdata['id'];
		polltitle = partdata['caption'];
		$('input[name=smq]').val(partdata['questioncount']);
		pollpage = 1;
		
		getPollUsers(partdata['id']);
		CachedPollsData = partdata;
		
	});
}			

function getPollUsers(pollid){
	
	
			$.ajax({
				type: 'GET',
				url: '/resources-ajax/polls/poll-info.php',
				data: {userpoll: pollid, limit: max_show, display_p: undisplay_show + 1},
				dataType:"json",
				cache: false,
				
			}).done(function(data){		
				
				
				CachedPoll[pollid] = data;
				displayPollUsers(CachedPoll[pollid]);

			});
			
	
}

function recacheMoreUsers(Index){
	
	
	if(loadingresults)
		return;
	
	var resultshidden=0;
	
	pollpage++;
	$('.loadmore').css('opacity', '0.5').html('Loading..');
	$('.pagecount').html('Page ' + pollpage);
	
	max_show += undisplay_show + 1;
	
	$.ajax({
				type: 'GET',
				url: '/resources-ajax/polls/poll-info.php',
				data: {userpoll: pollviewing, limit: max_show, display_p: undisplay_show + 1},
				dataType:"json",
				cache: false,
				
			}).done(function(data){		
					
				
				CachedPoll[pollviewing] = data;
				var cur_show = ((max_show - undisplay_show) <= 0 ? 1 : max_show - undisplay_show);
				$.each(data, function(key, val){

			if(cur_show <= max_show)
			{
				var username = val.username;
					
					if(!displayedUser(username))
					{
						var questions = val.questions;
						var figure = val.figure;
						var vip = val.vip;
						var last_online = val.last_online;
						var account_created = val.account_created;
						var online = val.online;
						
						
						
						 var timediff = Math.round(Math.abs((new Date(last_online * 1000).getTime() - new Date().getTime())/(24*60*60*1000)));
						 
						 if(timediff >= oldresultsclassification && !showinactive)
						 {
							 resultshidden++;
							 return;
						 }
						 if(val.banned == 'yes' && !$('input[name=sb]').prop('checked'))
						 {
							 resultshidden++;
							 return;
						 }
						 
						username = jQuery.trim(username.toLowerCase());
						
						DisplayedUsers[username.toLowerCase()] = {
							'id' : val.id,
							'username' : val.username,
							'questions' : questions,
							'figure' : figure,
							'vip' : vip,
							'last_online' : last_online,
							'account_created' : account_created,
							'online' : online,
						}
						
						
					}
					else
					{
						console.log('alrdy displayed');
					}
							
				cur_show++;
			}
		});
	
	
	
		
		var NextInstance = DisplayedUsers[(oFunctions.keys.next(DisplayedUsers, 0, Index + 1)).toLowerCase()];
			
		processPollUserClick(NextInstance['username']);
		
		$('.loadmore').css('opacity', '1.0').html('Load Next Page');
		
	});
}

function displayPollUsers(data){
	
	var cur_show = ((max_show - undisplay_show) <= 0 ? 1 : max_show - undisplay_show);
	var htmlToAppend = null;
	var resultshidden = 0;
	$('.polldata').stop().html('');
	
	
		if(Object.keys(data).length <= 0)
		{
			loadingresults = false;
			displayMorePollUsers();
			return;
		}
	
		$.each(data, function(key, val){

			if(cur_show <= max_show)
			{
				var username = val.username;
					
					if(!displayedUser(username))
					{
						var questions = val.questions;
						var figure = val.figure;
						var vip = val.vip;
						var last_online = val.last_online;
						var account_created = val.account_created;
						var online = val.online;
						
						
						 var timediff = Math.round(Math.abs((new Date(last_online * 1000).getTime() - new Date().getTime())/(24*60*60*1000)));
						 
						 if(timediff >= oldresultsclassification && !showinactive)
						 {
							 resultshidden++;
							 return;
						 }
						 if(val.banned == 'yes' && !$('input[name=sb]').prop('checked'))
						 {
							 resultshidden++;
							 return;
						 }
						 
						 if( !($('input[name=sif]').prop('checked')) && (Object.keys(questions).length < $('input[name=smq]').val()) )
						 {
							 resultshidden++;
							 return;
						 }
						 
						username = jQuery.trim(username.toLowerCase());
						
						DisplayedUsers[username.toLowerCase()] = {
							'id' : val.id,
							'username' : val.username,
							'questions' : questions,
							'figure' : figure,
							'vip' : vip,
							'last_online' : last_online,
							'account_created' : account_created,
							'online' : online,
						}
						
						var figdisplay = "https://www.habbo.com/habbo-imaging/avatarimage?figure=" + figure + "&head_direction=3&headonly=1";
						var appendbefore = "<div style='background:url(" + figdisplay + ") !important' class='figure'></div>";
						
						var append = "";
						var extraappend = '  id="' + username + '" style="';
					    extraappend += (timediff >= oldresultsclassification && markinactive) ? "opacity:0.6;background:#d64242;" : "";
						extraappend += (markbanned && val.banned == 'yes') ? "opacity:0.6;background:#1D1635 !important;'" : "";
						extraappend += ( (($('input[name=mfy]').prop('checked')) && (Object.keys(questions).length < $('input[name=smq]').val()))) ? "opacity:0.6;background:#DFE223 !important;'" : ""; 
						extraappend += '"';
						
						//alert(val.questions.length)
						console.log('[' + cur_show + ']Username: ' + username + " ; qcount: " + Object.keys(questions).length);
						
						// Other
						
						append += '<div class="polluser"';
						append += extraappend;
						append += " username='" + username + "'";
						append += " >";
						
						
						append += "<table width='100%'><tr>"
						
						append += "<td width='2%'>" + appendbefore + "</td>";
						
						append += "<td width='68%'><div class='pollusertext'>"
						// Inner
						append += username + "'s submission";
						append += "</div></td>";
						append += "<td width='30%'><div class='delete' username='" + val.username + "' userid='" + val.id + "' pollid='" + pollviewing + "'>Mark Read</div></td>"
						append += "</tr></table>";
						
						append += " </div>"
							
						$('.polldata').append(append);
						
					}
					else
					{
						console.log('alrdy displayed');
					}
							
				cur_show++;
			}
		});
		
		if(resultshidden > 0) {$('.polldata').append('<hr><br/> <center>' + resultshidden + " result(s) hidden.</center>");}
		var markreadc = $('.delete');
		markreadc.on('click', function(){
		
		
			var pollid = $(this).attr('pollid');
			var userid = $(this).attr('userid');
			var username = $(this).attr('username');
			MarkRead(pollid, userid, username);
			return false;
		
		});

	$('.polluser').on('click', function(){processPollUserClick($(this).attr('username'))});
	loadingresults = false;
	$('.loadmore').css('opacity', '1.0').html('Load Next Page');
	$('.loadless').css('opacity', '1.0').html('Load Previous Page');
	
	
}


	oFunctions = {};
    oFunctions.keys = {};
 
    //NEXT KEY
    oFunctions.keys.next = function(o, id, next){
        var keys = Object.keys( o ),
            idIndex = keys.indexOf( id ),
            nextIndex = idIndex += 1;
        if(nextIndex >= keys.length){
            return;
        }
        var nextKey = keys[ nextIndex + next]
        return nextKey;
    };
	

function processPollUserClick(username){
	
	var name = username.toLowerCase();
	
	var UserInstance = DisplayedUsers[name.toLowerCase()];
	
	var keys = Object.keys( DisplayedUsers );
	
	var Index = 0;
	for(var i=0; i < keys.length; i++)
	{
		if(name == keys[i])
			Index = i;
	}

	var NextInstance;
	var PrevInstance;
	
	if( (oFunctions.keys.next(DisplayedUsers, 0, Index + 1)) != undefined)
	{
		NextInstance = DisplayedUsers[(oFunctions.keys.next(DisplayedUsers, 0, Index + 1)).toLowerCase()];
		GlobalNInstance = NextInstance;
	}
	else
	{
		
		var count = Object.keys(DisplayedUsers).length;
		
		recacheMoreUsers(Index);
		
		count = Object.keys(DisplayedUsers).length;
		
	
		return;
	}

	if( (oFunctions.keys.next(DisplayedUsers, 0, Index - 1)) != undefined)
	{
		PrevInstance = DisplayedUsers[(oFunctions.keys.next(DisplayedUsers, 0, Index - 1)).toLowerCase()];
		GlobalPInstance = PrevInstance;
	}
	
	var questioncount = CachedPollsData['questioncount'];
	var userquestioncount = Object.keys(UserInstance['questions']).length;
	
	var htmla = "";
	
	$('.polldata').fadeOut(200,function(){	
	
		
		var figdisplay = "https://www.habbo.com/habbo-imaging/avatarimage?figure=" + UserInstance['figure'] + "&head_direction=3&headonly=1";
		var appendbefore = "<div style='background:url(" + figdisplay + ") !important' class='figure'></div>";
		
		htmla += "<table width='100%'><tr>"
						
		htmla += "<td width='2%'>" + appendbefore + "</td>";
		htmla += "<td width='9%'><div class='delete' style='background:#48CE26;color:white;cursor:pointer;' username='" + name + "' userid='" + UserInstance['id'] + "' pollid='" + pollviewing + "'>Mark Read</div></td>";
		htmla += "<td width='10%'><div style='height:25px;line-height:0px;'>Answered " + userquestioncount + "/" + questioncount + " questions</div></td>";
		htmla += "</tr></table>";
	
		$.each(UserInstance['questions'], function(key, value){
		
			var question = value.question;
			var answer = value.answer;
			
			htmla += "<b>" + question + "</b><br/>";
			htmla += answer + "<br/><br/>";
			
		});
	
		htmla += "</div>";
		$('.polldata').html(htmla).fadeIn();
		$('#polltitle').html(polltitle).append(' [' + name + '] ');
		viewinguser = true;
		
	});
		
		
	
		
}

function displayLessPollUsers(){
	
	if(loadingresults)
		return;
	
	if(viewinguser)
	{
		
		processPollUserClick(GlobalPInstance['username']);
		return;
	}
	
	if(max_show <= 0 || pollpage - 1 <= 0)
	{
		$('.loadless').css('opacity', '0.5').html('No results found!');
		return;
	}
	
	pollpage--;
	$('.loadless').css('opacity', '0.5').html('Loading..');
	$('.pagecount').html('Page ' + pollpage);
	
	max_show -= undisplay_show + 1;
	loadingresults = true;
	getPollUsers(pollviewing);
}


function displayMorePollUsers(){
	
	if(loadingresults)
		return;
	
	if(viewinguser)
	{
		processPollUserClick(GlobalNInstance['username']);
		return;
	}
	
	
	pollpage++;
	$('.loadmore').css('opacity', '0.5').html('Loading..');
	$('.pagecount').html('Page ' + pollpage);
	
	max_show += undisplay_show + 1;
	loadingresults = true;
	getPollUsers(pollviewing);
	
}

function displayedUser(username){
	if(jQuery.inArray(jQuery.trim(username.toLowerCase()), DisplayedUsers) == -1)
	{
		return false;
	}
	
	return true;
}

function getPollData(pollid){
	
}

function displayPoll(data){
	
	var polls = data.split('|');
	var clicked = false;
		
	$.each( polls, function( key, value ) {
	  
		if(value == undefined || value == '' || jQuery.trim(value) == '')
			return;
		
		var parts = value.split(':');
		var caption = parts[1];
		var id = parts[0];
		var roomid = parts[2];
		var invitation = parts[3];
		var greetings = parts[4];
		var prize = parts[5]; 
		var enabled = parts[6];
		var questioncount = parts[7];
		
		pollinfo.append('<div id="' + id + '" class="pollitem">' + caption + '</div>');
		
		var pollitem = $('.pollitem');
		
		
		
		pollitem.on('click', function(){
			
			if(id != $(this).attr('id'))
				return;
			
			var partdata = {
				'caption' : caption,
				'id' : id,
				'roomid' : roomid,
				'invitiation' : invitation,
				'greetings' : greetings,
				'prize' : prize,
				'enabled' : enabled,
				'questioncount' : questioncount, 
			};
			
			
			getPoll(partdata);
			
			
		});
		
	});
	
}

polltypeb.on('click', function(){
	
	
	polltypeb.not(this).css('background', 'white').css('opacity', '1.0').css('borderColor', 'black');
	$(this).css('opacity', '0.7').css('borderColor', 'orange');
	
	var type = $(this).attr('type');
	getPolls(type);
	
	
});



});