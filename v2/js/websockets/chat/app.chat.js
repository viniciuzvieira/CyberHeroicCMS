try {
    function ChatManager() {

        this.availableChats = {};
        var emojis = emlist;
        var scrolling = false;

        this.handleData = function(returnedData) {

            if (typeof returnedData === "undefined" && returnedData === "undefined")
                return;

            var handleAction = returnedData.action;
            var chatName = returnedData.chatname;

            switch (handleAction.toLowerCase()) {

                case "authorisechat": {

                        if (this.inChat(chatName)) {
                            return;
                        }

                        var newChat = new Chat(chatName);
                        this.availableChats[newChat.chatName] = newChat;
                        this.handleAuthentication(newChat.chatName);

                        break;
                    }

                case "leavechat": {

                        if (!this.inChat(chatName)) {
                            return;
                        }
												
						var chatHead = $('.chatHead[chatname=' + chatName + ']');
						
						var deleteAll = false;
						
						if (chatHead.length){
							
							var chatDisplay = $('.chatDisplay[chatname=' + chatName + ']');
							var chatRow = $('td[chatname=' + chatName + ']');
			
							if ((Object.keys(user.chatMgr.availableChats).length - 1) <= 0) {
								$('.chatHead').removeClass('active');
								$('.chatInfo').html('');
								$('#chatDisplays').html(user.chatMgr.returnBlankDisplay(chatName, 'Welcome to the chatbox'));
								$('.chatBox').fadeOut();
								deleteAll = true;
							}
							
							if(!deleteAll)
							{
								chatHead.remove();
								chatDisplay.remove();
								chatRow.remove();
								$('.chatHead').first().click();
							}
						}
						
						var chatInfo = $('.chatInfo');
						if(jQuery.trim(chatInfo.text()).toLowerCase() == jQuery.trim(chatName).toLowerCase())
						{
							chatInfo.text('');
						}
						
						
						
						this.availableChats[chatName].onUserLeave(user.name, user.figure);
						delete this.availableChats[chatName];
						
                        break;
                    }

                case "clearchat": {

                        var append = "";
                        append += user.chatMgr.returnGreyMsg("Cleared the chat!");

                        $('.chatDisplay[chatname=' + chatName + ']').html(append);

                        break;
                    }

                case "disconnectchat": {

                        $('.chatHead').each(function() {

                            if (($('.chatHead').length - 1) == 0)
                                return;

                            $(this).remove();
                        });

                        $('.chatDisplay').each(function() {
                            $(this).remove();
                        });

                        $('#chatDisplays').html(user.chatMgr.returnBlankDisplay('None', 'Disconnected from chat! Connect to a new one!'));

                        $('.chatInfo').html('No chat');

                        $('.chatElement').val('');

                        break;
                    }

                case "buildchat": {
					
					var chatOwnerFigure = returnedData.chatownerfigure;
					
                        $('.chatPasswordBox').each(function() {
                            $(this).remove();
                        });

						$('.chatBox').addClass('topLayer');
						$('.availableChatsBox').removeClass('topLayer');
						
						$('.chatBox').unbind('click').on('click', function(){	
							$(this).addClass('topLayer')
							$('.availableChatsBox').removeClass('topLayer');
						}).click();
	
                        if (this.inChat(chatName)) {

                            $('.chatBox').find('.chatInfo').html(chatName);
                            $('.chatBox').show();

                            refreshChatStats(chatName);
                            user.chatMgr.scrollDownChat();
                            bindChatHead();

                            return;
                        }

                        if (Object.keys(this.availableChats).length == 0) {
                            //use first tab
							
							$('.chatHead').first().css('background', 'url(https://www.habbo.com/habbo-imaging/avatarimage?figure=' + chatOwnerFigure + '&headonly=1&esture=sml&direction=2&size=sml)');
                            $('.chatBox').attr('name', chatName);
                            $('.chatHead').first().attr('chatname', chatName);
                            $('.chatHead').first().addClass('active');
                            $('.chatDisplay').first().attr('chatname', chatName);

                            return;
                        } else {
                            // switch tab
                            if ($('.chatHead[chatname=' + chatName + ']').length > 0) {
                                refreshChatStats(chatName);
                                return;
                            }

                            // add new tabs
                            $('.chatBox').attr('name', chatName);
                            $('.appendedTabs').append("<td chatname='" + chatName + "'><div chatname='" + chatName + "' class='chatHead'><div class='chatImgHead' " + user.chatMgr.getFigureStyle(chatOwnerFigure) + "><div class='chatHeadClose'></div></div></div></td>");

                            // add new box
                            var append = "<div class='chatDisplay' chatname='" + chatName + "'>";
                            append += "<div class='chatNotification'>";
                            append += "<div class='chatNotificationTxt'>";
                            append += "Welcome to the chatbox";
                            append += "</div>";
                            append += "</div>";
                            append += "</div>";
                            $('#chatDisplays').append(append);

                            refreshChatStats(chatName);

                        }

                        $('.chatBox').find('.chatInfo').html(chatName);
                        $('.chatBox').show();

                        user.chatMgr.scrollDownChat();

                        break;
                    }

                case "onchat": {
                        var chatUserName = returnedData.chatusername;
                        var chatUserMessage = returnedData.chatmessage;
                        var chatUserFigure = returnedData.chatfigure;
                        this.getChat(chatName).onReceiveChat(chatName, chatUserName, chatUserMessage, chatUserFigure);
                        break;
                    }

                case "onsendchat": {

                        var chatUserMessage = returnedData.chatmessage;
                        var entry = user.chatMgr.returnChatEntry(chatName, chatUserMessage);
                        $('.chatDisplay[chatname=' + chatName + ']').append(entry);
                        user.chatMgr.scrollDownChat();

                        break;
                    }

                case "newjoinedchat": {


                        var chatUserName = returnedData.chatusername;
						var chatUserFigure = returnedData.chatuserfigure;
						
                        this.getChat(chatName).onNewUser(chatUserName, chatUserFigure);

                        break;
                    }

                case "newleftchat": {
                        
						var chatUserName = returnedData.chatusername;
						var chatUserFigure = returnedData.chatuserfigure;
						
						if(chatName == null)
							return;
						
                        this.getChat(chatName).onUserLeave(chatUserName, chatUserFigure);

                        break;
                    }

                case "newgreymsg": {

                        var Message = returnedData.chatmessage;
                        this.getChat(chatName).addGreyMessage(Message);

                        break;
                    }

                case "newwarnchat": {
                        var Message = returnedData.chatmessage;
                        this.getChat(chatName).addWarningMessage(Message);
                        break;
                    }

                case "newnotifyuser": {
                        this.createNotification(returnedData.chatmessage);
                        break;
                    }

                case "getchatrooms": {

                        $('.availableChatsBox').fadeIn();
						$('.availableChatsBox').draggable({ disabled: true }).draggable({ disabled: false, cancel: '.abottomContainer' });
                        $('.aChats').html('');

                        var chats = JSON.parse(returnedData.returnedChats);
						var chatArray = [];
						
						
						$.each(chats, function(key, value){
							
							var chatValues = JSON.parse(value)
							var cvName = chatValues.chatName;
							var cvVisitors = parseInt(chatValues.chatVisitors);
							var cvType = chatValues.chatType;						
							
							var newArray = {
								cName: cvName,
								cVisitors: parseInt(cvVisitors),
								cType: cvType
							};
							
							chatArray.push(newArray);
							
						});
						
						function sortByKey(array, key) {
							return array.sort(function(a, b) {
								
								var x = parseInt(a.cVisitors); var y = parseInt(b.cVisitors);
								return ((x < y) ? -1 : ((x > y) ? 1 : 0));
								
							});
						}
						
						$.each(sortByKey(chatArray, 'cVisitors').reverse(), function(index, value){
							
							var chatsName = value.cName;
							var chatsType = value.cType;
							var chatsVisitors = value.cVisitors;
							
							var append = user.chatMgr.returnRoomEntry(chatsName, chatsVisitors, chatsType);
                            $('.aChats').append(append);
							
						});
						
						 $('.achatItem').unbind('click').on('click', function() {
							var chatName = $(this).attr('chatname');
							app['sendData'](
							'event_chatroom', JSON.stringify({
								action: "requestjoin",
								chatname: chatName,
								}), false, true);
							 $('.availableChatsBox').hide();
						  });
                        
						
						
						$('.availableChatsBox').unbind('click').on('click', function(){	
							$(this).addClass('topLayer');
							$('.chatBox').removeClass('topLayer');
						}).click();
						
						break;
                    }

                case "request_chatpassword": {
                        this.createPasswordInput(chatName);
                        break;
                    }

                case "specialembed": {

                        var embedType = returnedData.chatembedtype;
                        var embedLink = returnedData.chatembedlink;
                        var embedExtra = returnedData.chatembedextra;
                        var embedAction = returnedData.chatembedaction;

                        if (embedType == "youtube") {

                            var constructedEmbed = '<iframe width="477" height="200" src="https://www.youtube.com/embed/' + embedLink + '" frameborder="0" allowfullscreen></iframe>';
                            var entry = "";

                            if (embedAction == "send") {
                                entry = this.getChat(chatName).returnEmbedEntry(chatName, embedType, embedLink, embedExtra, embedAction, constructedEmbed, "null", "null");
                            } else if (embedAction == "receive") {
                                entry = this.getChat(chatName).returnEmbedEntry(chatName, embedType, embedLink, embedExtra, embedAction, constructedEmbed, returnedData.chatusername, returnedData.chatfigure);
                            }

                            $('.chatDisplay[chatname=' + chatName + ']').append(entry);
                            this.scrollDownChat();
                        } else if (embedType == "image") {

                            var constructedEmbed = "";
                            var entry = "";

                            if (embedExtra == "prntscr") {
                                $.ajax({
                                    method: "POST",
                                    url: embedLink,
                                    cache: false
                                }).done(function(data) {
                                    var imgID = (data.split('<img src="<img src="http://image.prntscr.com/image/"')[1]).split('.png')[0];
                                    constructedEmbed = "<img src='http://image.prntscr.com/image/" + imgID + ".png'/>";
                                });
                            } else if (embedExtra == "raw") {
                                constructedEmbed = "<a href='" + embedLink + "' target='_blank'><img style='max-width: 400px; max-height: 200px;' src='" + embedLink + "'/></a>";
                            }

                            if (embedAction == "send") {
                                entry = this.getChat(chatName).returnEmbedEntry(chatName, embedType, embedLink, embedExtra, embedAction, constructedEmbed, "null", "null");
                            } else if (embedAction == "receive") {
                                entry = this.getChat(chatName).returnEmbedEntry(chatName, embedType, embedLink, embedExtra, embedAction, constructedEmbed, returnedData.chatusername, returnedData.chatfigure);
                            }

                            $('.chatDisplay[chatname=' + chatName + ']').append(entry);
                            this.scrollDownChat();
                        }

                        break;
                    }

            }
        };
        this.handleAuthentication = function(name) {
            app['sendData']('event_chatroom', JSON.stringify({

                action: "joinedchat",
                chatname: name,

            }), false, true);
        };

        this.getChatTimestamp = function() {
            return Math.floor(new Date() / 1000);
        };
        this.getTimeDifference = function(timestamp1, timestamp2) {
            var ret = "";
            var difference = timestamp2 - timestamp1;

            if (difference > 59) {
                ret = Math.floor(difference / 60) + " minutes ago";

                if (difference > 3600)
                    ret = Math.floor((difference / 60) / 60) + " hours ago";
            } else {
                ret = difference + " seconds ago";
            }

            return ret;
        };
        this.getChat = function(chatName) {
            return this.availableChats[chatName];
        };
        this.getFigureStyle = function(Figure) {
            var FigureLink = "https://www.habbo.com/habbo-imaging/avatarimage?figure=" + Figure + "&headonly=1&gesture=sml&direction=2&size=sml";
            return "style='background:url(" + FigureLink + ") !important'";
        }
        this.getFilteredMessage = function(Message) {
            return removeTags(Message);
        };
        this.organiseEmojis = function(Message) {

            var returnMsg = Message;

            var Parts = returnMsg.split(']:');
            var savedstring = "";

            $.each(Parts, function(key, value) {

                if (Parts[key].indexOf(":[") == -1)
                    return;

                var Emoji = Parts[key].split(':')[0];
                var Search = "[e]:" + Emoji + ":[/e]";

                var returning = returnMsg.replace(Search, "<div class='displayEmojiContainer'><div id='displayEmoji' style='background-image:url(./v2/images/chat/emojis/" + Emoji + ".png);' class='emojiNavigatorItemImg'></div></div>");
                returnMsg = returning;

            });

            return returnMsg;
        };

        this.checkChatting = function(chatName) {

            if (!(jQuery.trim($('.chatElement').val()))) {
                return true;
            }

            if (!this.inChat(chatName)) {
                var chatName = $(this).attr('chatname');
                var obj = JSON.stringify({
                    action: "newnotifyuser",
                    chatname: chatName,
                    chatmessage: "You not in the chat '" + chatName + "'. Try connecting / reconnecting.",
                });

                if (typeof obj != "undefined" && obj != "undefined")
                    var jsonObj = JSON.parse(obj);

                user.chatMgr.handleData(jsonObj);

                $('.chatElement').val('');

                return true;
            }

            return false;
        }
        this.inChat = function(chatName) {

            var found = false;

            $.each(this.availableChats, function(key, value) {
				
				if(typeof chatName == undefined || typeof chatName === "undefined" || chatName === "undefined")
					return false;
				
                if (jQuery.trim(chatName.toLowerCase()) == jQuery.trim(value.chatName.toLowerCase())) {
                    found = true;
                }
            });

            return found;
        };
        this.logChatEntry = function(chatEntry) {

            chatEntry.chat.allChatEntrys.push(chatEntry);

        };

        this.scrollDownChat = function() {

            if (scrolling)
                return;

            $('.chatBodyContainer').scrollTop($('.chatBodyContainer').prop('scrollHeight'));
        };
        this.createNotification = function(Message) {
            $('.chatAlertBox').each(function() {
                $(this).remove()
            });
            $('body').append(this.returnUserAlert(Message));
            $('.chatAlertBox').draggable();
            $('.chatAlertBoxClose').on('click', function() {
                $('.chatAlertBox').remove();
            });
        }
        this.createPasswordInput = function(chatName) {
            $('body').append(this.returnPasswordAlert(chatName));
            $('.chatPasswordBox').draggable();
            bindChatPassword(chatName);
        }

        this.returnBlankDisplay = function(chatName, defaultMsg) {
            var append = "<div class='chatDisplay' chatname='" + chatName + "'>";
            append += "<div class='chatNotification'>";
            append += "<div class='chatNotificationTxt'>";
            append += defaultMsg;
            append += "</div>";
            append += "</div>";
            append += "</div>";

            return append;
        };
        this.returnReceivedEntry = function(chatName, chatUserName, chatUserMessage, chatUserFigure) {

            var chatEntryID = user.chatMgr.availableChats[chatName].allChatEntrys.length + 1;
            var entry = "";
            entry += "<div class='OchatMessageEntry' entryid='" + chatEntryID + "'>";
            entry += "<table width='100%'>";
            entry += "<tr>";
            entry += "<td>";
            entry += "<div class='OchatMessagerFigure' " + user.chatMgr.getFigureStyle(chatUserFigure) + ">";
            entry += "<div class='OchatMessagerName'>" + chatUserName + "</div>";
            entry += "<div class='OchatArrow'></div>";
            entry += "</div>";
            entry += "</td>";
            entry += "</tr>";
            entry += "<tr>";
            entry += "<td>";
            entry += "<div class='OchatMessageBox'>" + user.chatMgr.organiseEmojis(user.chatMgr.getFilteredMessage(chatUserMessage)) + "";
            entry += "<div class='OchatMessageTimeAgo'>0 seconds ago</div>";
            entry += "</div>";
            entry += "</td>";
            entry += "</tr>";
            entry += "</table>";
            entry += "</div>";

            return entry;
        };
        this.returnChatEntry = function(chatName, message) {
            var chatEntryID = user.chatMgr.availableChats[chatName].allChatEntrys.length + 1;

            var entry = "";
            entry += "<div class='chatMessageEntry' entryid='" + chatEntryID + "'>";
            entry += "<table width='100%'>";
            entry += "<tr>";
            entry += "<td>";
            entry += "<div class='chatMessagerFigure' " + user.chatMgr.getFigureStyle(user.figure) + ">";
            entry += "<div class='chatMessagerName'>" + user.name + "</div>";
            entry += "<div class='chatArrow'></div>";
            entry += "</div>";
            entry += "</td>";
            entry += "</tr>";
            entry += "<tr>";
            entry += "<td>";
            entry += "<div class='chatMessageBox'>" + user.chatMgr.organiseEmojis(user.chatMgr.getFilteredMessage(message)) + "";
            entry += "<div class='chatMessageTimeAgo'>0 seconds ago</div>";
            entry += "</div>";
            entry += "</td>";
            entry += "</tr>";
            entry += "</table>";
            entry += "</div>";

            return entry;
        };
        this.returnGreyMsg = function(message) {

            var entry = "";
            entry += "<div class='chatMessageEntry'>";
            entry += "<div class='chatGreyNotification'>";
            entry += message;
            entry += "</div>";
            entry += "</div>";

            return entry;
        };
        this.returnWarningMsg = function(message) {

            var entry = "";
            entry += "<div class='chatNotification'>";
            entry += "<div class='chatNotificationTxt'>";
            entry += message;
            entry += "</div>";
            entry += "</div>";

            return entry;
        };
        this.returnRoomEntry = function(chatName, chatVisitors, chatType) {

            var entry = "<tr>";
            entry += "<td><div chatname='" + chatName + "' class='achatItem " + chatType + "'>" + chatName + "</div></td><td><div class='achatItemVisitors'>" + chatVisitors + " visitors</div>";
            entry += "</tr>";

            return entry;
        };
        this.returnUserAlert = function(Message) {

            var entry = "";
            entry += "<div class='chatAlertBox'>";
            entry += "<div class='chatAlertBoxClose'></div>";
            entry += "<div class='chatAlertBoxContainer'>" + Message + "</div>";
            entry += "</div>";


            return entry;
        };
        this.returnPasswordAlert = function(chatName) {

            var entry = "";
            entry += "<div class='chatPasswordBox'>";
            entry += "<div class='chatPasswordInputClose'></div>";
            entry += "<input placeholder='Enter password for " + chatName + " and press enter!' class='chatPasswordInput'/>";
            entry += "</div>";

            return entry;
        };

    }

    function Chat(name) {

        this.chatName = name;
        this.chatBadge = "";
        this.chatUsers = {};
        this.allChatEntrys = [];

        this.getChatBadge = function() {
            return "";
        };
        this.getChatUsers = function() {

        };

        this.onNewUser = function(chatUserName, chatUserFigure) {

            var entry = "";
            entry += "<div class='chatMessageEntry'>";
            entry += "<div class='chatGreyNotification'>";
			entry += '<table width="" style=" position: relative; left: 27%; ">';
			entry += '<tbody><tr><td width="0%">';
			entry += '<img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=' + chatUserFigure + '&headonly=1&esture=sml&direction=2&size=s"></td>';
            entry += "<td width=''>";
			entry += "" + chatUserName + " <b>entered</b> the chatbox";
			entry += "</div> </td> </tr> </tbody></table>";
            entry += "</div>";
            entry += "</div>";

            $('.chatDisplay[chatname=' + this.chatName + ']').append(entry);

            user.chatMgr.scrollDownChat();

            this.updateEntryTimes();
        };
        this.onUserLeave = function(chatUserName, chatUserFigure) {

			if(chatUserName == user.name)
				return;
			
            var entry = "";
            entry += "<div class='chatMessageEntry'>";
            entry += "<div class='chatGreyNotification'>";
			entry += '<table width="" style=" position: relative; left: 27%; ">';
			entry += '<tbody><tr><td width="0%">';
			entry += '<img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=' + chatUserFigure + '&headonly=1&esture=sml&direction=2&size=s"></td>';
            entry += "<td width=''>";
			entry += "" + chatUserName + " <b>left</b> the chatbox";
			entry += "</div> </td> </tr> </tbody></table>";
            entry += "</div>";
            entry += "</div>";

            $('.chatDisplay[chatname=' + this.chatName + ']').append(entry);

            user.chatMgr.scrollDownChat();

            this.updateEntryTimes();
        };

        this.updateEntryTimes = function(sent) {
            $.each(this.allChatEntrys, function(key, val) {

                var chatMessage = val.message;
                var chatdiv = $('div[entryid=' + val.entryID + ']');
                var timediv;

                if (val.sent)
                    timediv = chatdiv.find('.chatMessageTimeAgo').first();
                else
                    timediv = chatdiv.find('.OchatMessageTimeAgo').first();

                timediv.html(user.chatMgr.getTimeDifference(val.timestamp, user.chatMgr.getChatTimestamp()));

            });

        };
        this.getInputtedText = function() {
            return $('.chatElement').val();
        };
        this.returnEmbedEntry = function(chatName, embedType, embedLink, embedExtra, embedAction, constructedEmbed, username, figure) {

            var chatEntryID = user.chatMgr.availableChats[chatName].allChatEntrys.length + 1;
            var entry = "";


            if (embedAction == "send") {
                entry += "<div class='chatMessageEntry' entryid='" + chatEntryID + "'>";
                entry += "<table width='100%'>";
                entry += "<tr>";
                entry += "<td>";
                entry += "<div class='chatMessagerFigure' " + user.chatMgr.getFigureStyle(user.figure) + ">";
                entry += "<div class='chatMessagerName'>" + user.name + "</div>";
                entry += "<div class='chatArrow'></div>";
                entry += "</div>";
                entry += "</td>";
                entry += "</tr>";
                entry += "<tr>";
                entry += "<td>";
                entry += "<div class='chatMessageBox'>" + constructedEmbed + "";
                entry += "<div class='chatMessageTimeAgo'>0 seconds ago</div>";
                entry += "</div>";
                entry += "</td>";
                entry += "</tr>";
                entry += "</table>";
                entry += "</div>";
            } else {
                entry += "<div class='OchatMessageEntry' entryid='" + chatEntryID + "'>";
                entry += "<table width='100%'>";
                entry += "<tr>";
                entry += "<td>";
                entry += "<div class='OchatMessagerFigure' " + user.chatMgr.getFigureStyle(figure) + ">";
                entry += "<div class='OchatMessagerName'>" + username + "</div>";
                entry += "<div class='OchatArrow'></div>";
                entry += "</div>";
                entry += "</td>";
                entry += "</tr>";
                entry += "<tr>";
                entry += "<td>";
                entry += "<div class='OchatMessageBox'>" + constructedEmbed + "";
                entry += "<div class='OchatMessageTimeAgo'>0 seconds ago</div>";
                entry += "</div>";
                entry += "</td>";
                entry += "</tr>";
                entry += "</table>";
                entry += "</div>";
            }

            return entry;
        }
        this.onReceiveChat = function(chatName, chatUserName, chatUserMessage, chatUserFigure) {

            var chatEntryID = this.allChatEntrys.length + 1;
            var entry = user.chatMgr.returnReceivedEntry(chatName, chatUserName, chatUserMessage, chatUserFigure);

            $('.chatDisplay[chatname=' + chatName + ']').append(entry);

            user.chatMgr.scrollDownChat();

            var newEntry = new chatEntry(chatEntryID, chatUserMessage, user.chatMgr.getChat(this.chatName), false);
            user.chatMgr.logChatEntry(newEntry);

            this.updateEntryTimes();
        };
        this.onChat = function(message) {

            if (message.startsWith("/")) {

                app['sendData']('event_chatroom', JSON.stringify({
                    action: "onchatcommand",
                    chatname: name,
                    chatusername: user.name,
                    chatmessage: message
                }), false, true);

                return;
            }

            var chatEntryID = this.allChatEntrys.length + 1;

            var newEntry = new chatEntry(chatEntryID, message, user.chatMgr.getChat(this.chatName), true);

            user.chatMgr.logChatEntry(newEntry);
            this.broadCastChatEntry(newEntry);

            this.updateEntryTimes();
        };
        this.broadCastChatEntry = function(chatEntry) {
            app['sendData'](
                'event_chatroom', JSON.stringify({
                    action: "onchat",
                    chatname: name,
                    chatusername: user.name,
                    chatmessage: chatEntry.message
                }), false, true);
        };
        this.addGreyMessage = function(message) {

            var entry = user.chatMgr.returnGreyMsg(message);

            $('.chatDisplay[chatname=' + this.chatName + ']').append(entry);

            user.chatMgr.scrollDownChat();

            this.updateEntryTimes();
        };
        this.addWarningMessage = function(message) {

            var entry = user.chatMgr.returnWarningMsg(message);

            $('.chatDisplay[chatname=' + this.chatName + ']').append(entry);

            user.chatMgr.scrollDownChat();

            this.updateEntryTimes();
        };

    }

    function chatEntry(entryid, message, chat, sent) {
        this.entryID = entryid;
        this.message = message;
        this.chat = chat;
        this.timestamp = user.chatMgr.getChatTimestamp();
        this.sent = sent;
        this.test = function() {
            alert('test');
        };
    }

    /*
     *
     *
     *	Binding Chat Events
     *
     *
     */

    $('.chatElement').unbind('keypress');
    $('.sendBtn').unbind('click');
    $('.chatMinimize').unbind('click');
	$('.aChatsBoxClose').unbind('click');
    $('.chatSettings').unbind('click');
    $('.chatSettingsClose').unbind('click');
    $('.achatItem').unbind('click');
	
	
	
    $('.chatElement').on('keypress', function(event) {
        if (event.which == 13) {
            var chatName = $('.chatBox').attr('name').toLowerCase();

            if (user.chatMgr.checkChatting(chatName))
                return;

            var Message = user.chatMgr.availableChats[chatName].getInputtedText();
            user.chatMgr.availableChats[chatName].onChat(Message);

            $('.chatElement').val('');
        }
    });

    $('.sendBtn').on('click', function() {

        var chatName = $('.chatBox').attr('name').toLowerCase();

        if (user.chatMgr.checkChatting(chatName))
            return;

        var Message = user.chatMgr.availableChats[chatName].getInputtedText();
        user.chatMgr.availableChats[chatName].onChat(Message);

        $('.chatElement').val('');
    });

    $('.chatMinimize').on('click', function() {
        $('.chatBox').hide();
        $('.emojiBox').remove();
        $('.chatSettingsBox').hide();
    });
	
	$('.aChatsBoxClose').on('click', function() {
		$('.availableChatsBox').hide();
	});
	
	$('.chatBox').draggable({cancel: '.chatBodyContainer, .chatElement '});
	
    $('.chatSettings').on('click', function() {
        $('.chatSettingsBox').show();
    });

    $('.chatSettingsClose').on('click', function() {
        $('.chatSettingsBox').hide();
    });


    function bindChatHead() {
        $('.chatHead').unbind('click');
        $('.chatHeadClose').unbind('click');
        $('.chatHead').on('click', function() {

            var chatName = $(this).attr('chatname');
            var obj = JSON.stringify({
                action: "buildchat",
                chatname: chatName,
            });

            if (typeof obj != "undefined" && obj != "undefined")
                var jsonObj = JSON.parse(obj);

            user.chatMgr.handleData(jsonObj);
        });
        $('.chatHeadClose').on('click', function() {

			var chatHead = $(this).closest('.chatHead');   
			var chatName = chatHead.attr('chatname');         
			var chatDisplay = $('.chatDisplay[chatname=' + chatName + ']');
			var chatRow = $('td[chatname=' + chatName + ']');
			
            app['sendData'](
                'event_chatroom', JSON.stringify({
                    action: "leavechat",
                    chatname: chatName,
                }), false, true);
        });
    }

    function refreshChatStats(chatName) {

        $('.chatBox').attr('name', chatName);

        var chatHead = $('.chatHead[chatname=' + chatName + ']');
        $('.chatHead').not(chatHead).removeClass('active');
        chatHead.addClass('active');

        var chatDisplay = $('.chatDisplay[chatname=' + chatName + ']');
        $('.chatDisplay').not(chatDisplay).hide();
        chatDisplay.show();
    }

    function bindChatPassword(chatName) {
        $('.chatPasswordInput').unbind('keypress');
        $('.chatPasswordInputClose').unbind('click');

        $('.chatPasswordInput').on('keypress', function(event) {
            if (event.which == 13) {
                app['sendData']('event_chatroom', JSON.stringify({
                    action: "checkpassword",
                    chatname: chatName,
                    password: $(this).val()
                }), false, true);
            }
        });

        $('.chatPasswordInputClose').on('click', function() {
            $('.chatPasswordBox').remove();
        });
    }

    bindChatHead();




    /*
     *
     * Emoji stuff
     *
     */

    function loadNavigatorItems() {

        var tabid = -1;

        $.each(emlist, function(key, value) {
            tabid++;
            var img = value['name'].split('icon-')[1].split('">')[0];
            $('.emojiNavigator').append("<div tabid='" + tabid + "' class='emojiNavigatorItem'><div style='background-image:url(./v2/images/chat/emojis/" + img + ".png);' class='emojiNavigatorItemImg'></div></div>");

        });

        $('.emojiNavigatorItem').unbind('click');

        $('.emojiNavigatorItem').on('click', function() {
            emojiNavigatorItemClick($(this));
        });

        $('.emojiNavigatorItem').first().addClass('active');
    }

    function retrieveEmojis(navigatorID) {
        var emojis = emlist[navigatorID]['icons'];
        $.each(emojis, function(key, value) {
            var emojiName = key;
            var emojiFile = value;
            var div = "<div class='emoji' emojiname='" + emojiName + "' style='background-image:url(./v2/images/chat/emojis/" + emojiFile + ");'></div>";
            $('.emojiContainer').append(div);
        });

        $('.emoji').unbind('click');
        $('.emoji').on('click', function() {
            var emojiName = $(this).attr('emojiname');
            inputEmoji(emojiName);
        });
    }

    function emojiNavigatorItemClick(element) {

        var thetabid = $(element).attr('tabid');
        var tabicons = emlist[thetabid]['icons'];
        $('.emojiContainer').html('');

        retrieveEmojis(thetabid);

        $('.emojiNavigatorItem').not(element).removeClass('active');
        $(element).addClass('active');
    }

    function inputEmoji(emojiName) {
        $('.chatElement').val($('.chatElement').val() + ' [e]' + emojiName + '[/e] ');
        $('.emojiBox').remove();
        $('.chatElement').click();
    }

    function bindEmojiBtn() {
        $('.emojiBtn').unbind('click').on('click', function() {

            $('.emojiBox').remove();
           

            var append = "";
            append += "<div class='emojiBox'>";
            append += "<div class='emojiBoxClose'></div>";
            append += "<div class='emojiNavigator'>";
            append += "</div>";
            append += "<div class='emojiContainer'>";
            append += "</div>";
            append += "</div>";

            $('body').append(append);

            loadNavigatorItems();
            retrieveEmojis(0);

            $('.emojiBoxClose').unbind('click').on('click', function() {
                $('.emojiBox').remove();
            });
			
			$('.emojiBox').draggable({cancel: '.emojiContainer'});

        });
    }


    bindEmojiBtn();

    setTimeout(function() {
        user.chatMgr = new ChatManager();
    }, 1000);
} catch (e) {

}

$('.chatBodyContainer').unbind('scroll').scroll(function() {

    scrolling = true;

    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
        scrolling = false;
        console.log("Haven't scrolled in 3000ms!");
        setTimeout(function() {
            user.chatMgr.scrollDownChat();
        }, 7000);
    }, 3000));
});