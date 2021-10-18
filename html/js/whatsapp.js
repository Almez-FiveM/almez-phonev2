var WhatsappSearchActive = false;
var OpenedChatPicture = null;

$(document).ready(function(){
    $("#whatsapp-search-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".whatsapp-chats .whatsapp-chat").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

$(document).on('click', '#whatsapp-search-chats', function(e){
    e.preventDefault();

    if ($("#whatsapp-search-input").css('display') == "none") {
        $("#whatsapp-search-input").fadeIn(150);
        WhatsappSearchActive = true;
    } else {
        $("#whatsapp-search-input").fadeOut(150);
        WhatsappSearchActive = false;
    }
});

$(document).on('click', '.whatsapp-chat', function(e){
    e.preventDefault();

    var ChatId = $(this).attr('id');
    var ChatData = $("#"+ChatId).data('chatdata');

    MI.Phone.Functions.SetupChatMessages(ChatData);

    $.post('http://almez-phonev2/ClearAlerts', JSON.stringify({
        number: ChatData.number
    }));

    if (WhatsappSearchActive) {
        $("#whatsapp-search-input").fadeOut(150);
    }

    $(".whatsapp-openedchat").css({"display":"block"});
    $(".whatsapp-openedchat").animate({
        left: 0+"vh"
    },200);
    
    $(".whatsapp-chats").animate({
        left: 30+"vh"
    },200, function(){
        $(".whatsapp-chats").css({"display":"none"});
    });

    $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 150);

    if (OpenedChatPicture == null) {
        OpenedChatPicture = "./img/default.png";
        if (ChatData.picture != null || ChatData.picture != undefined || ChatData.picture != "default") {
            OpenedChatPicture = ChatData.picture
        }
        $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
    }
});

$(document).on('click', '#whatsapp-openedchat-back', function(e){
    e.preventDefault();
    $.post('http://almez-phonev2/GetWhatsappChats', JSON.stringify({}), function(chats){
        MI.Phone.Functions.LoadWhatsappChats(chats);
    });
    OpenedChatData.number = null;
    $(".whatsapp-chats").css({"display":"block"});
    $(".whatsapp-chats").animate({
        left: 0+"vh"
    }, 200);
    $(".whatsapp-openedchat").animate({
        left: -30+"vh"
    }, 200, function(){
        $(".whatsapp-openedchat").css({"display":"none"});
    });
    OpenedChatPicture = null;
});

MI.Phone.Functions.GetLastMessage = function(messages) {
    var CurrentDate = new Date();
    var CurrentMonth = CurrentDate.getMonth();
    var CurrentDOM = CurrentDate.getDate();
    var CurrentYear = CurrentDate.getFullYear();
    var LastMessageData = {
        time: "00:00",
        message: "nikss"
    }

    $.each(messages[messages.length - 1], function(i, msg){
        var msgData = msg[msg.length - 1];
        LastMessageData.time = msgData.time
        LastMessageData.message = msgData.message
    });

    return LastMessageData
}

GetCurrentDateKey = function() {
    var CurrentDate = new Date();
    var CurrentMonth = CurrentDate.getMonth();
    var CurrentDOM = CurrentDate.getDate();
    var CurrentYear = CurrentDate.getFullYear();
    var CurDate = ""+CurrentDOM+"-"+CurrentMonth+"-"+CurrentYear+"";

    return CurDate;
}

MI.Phone.Functions.LoadWhatsappChats = function(chats) {
    $(".whatsapp-chats").html("");
    $.each(chats, function(i, chat){
        var profilepicture = "./img/default.png";
        if (chat.picture !== "default") {
            profilepicture = chat.picture
        }
        var LastMessage = MI.Phone.Functions.GetLastMessage(chat.messages);
        var ChatElement = '<div class="whatsapp-chat" id="whatsapp-chat-'+i+'"><div class="whatsapp-chat-picture" style="background-image: url('+profilepicture+');"></div><div class="whatsapp-chat-name"><p>'+chat.name+'</p></div><div class="whatsapp-chat-lastmessage"><p>'+LastMessage.message+'</p></div> <div class="whatsapp-chat-lastmessagetime"><p>'+LastMessage.time+'</p></div><div class="whatsapp-chat-unreadmessages unread-chat-id-'+i+'">1</div></div>';
        
        $(".whatsapp-chats").append(ChatElement);
        $("#whatsapp-chat-"+i).data('chatdata', chat);

        if (chat.Unread > 0 && chat.Unread !== undefined && chat.Unread !== null) {
            $(".unread-chat-id-"+i).html(chat.Unread);
            $(".unread-chat-id-"+i).css({"display":"block"});
        } else {
            $(".unread-chat-id-"+i).css({"display":"none"});
        }
    });
}

MI.Phone.Functions.ReloadWhatsappAlerts = function(chats) {
    $.each(chats, function(i, chat){
        if (chat.Unread > 0 && chat.Unread !== undefined && chat.Unread !== null) {
            $(".unread-chat-id-"+i).html(chat.Unread);
            $(".unread-chat-id-"+i).css({"display":"block"});
        } else {
            $(".unread-chat-id-"+i).css({"display":"none"});
        }
    });
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

FormatChatDate = function(date) {
    var TestDate = date.split("-");
    var NewDate = new Date((parseInt(TestDate[1]) + 1)+"-"+TestDate[0]+"-"+TestDate[2]);

    var CurrentMonth = monthNames[NewDate.getMonth()];
    var CurrentDOM = NewDate.getDate();
    var CurrentYear = NewDate.getFullYear();
    var CurDateee = CurrentDOM + "-" + NewDate.getMonth() + "-" + CurrentYear;
    var ChatDate = CurrentDOM + " " + CurrentMonth + " " + CurrentYear;
    var CurrentDate = GetCurrentDateKey();

    var ReturnedValue = ChatDate;
    if (CurrentDate == CurDateee) {
        ReturnedValue = "Today";
    }

    return ReturnedValue;
}

FormatMessageTime = function() {
    var NewDate = new Date();
    var NewHour = NewDate.getHours();
    var NewMinute = NewDate.getMinutes();
    var Minutessss = NewMinute;
    var Hourssssss = NewHour;
    if (NewMinute < 10) {
        Minutessss = "0" + NewMinute;
    }
    if (NewHour < 10) {
        Hourssssss = "0" + NewHour;
    }
    var MessageTime = Hourssssss + ":" + Minutessss
    return MessageTime;
}

$(document).on('click', '#whatsapp-openedchat-send', function(e){
    e.preventDefault();

    var Message = $("#whatsapp-openedchat-message").val();

    if (Message !== null && Message !== undefined && Message !== "") {
        $.post('http://almez-phonev2/SendMessage', JSON.stringify({
            ChatNumber: OpenedChatData.number,
            ChatDate: GetCurrentDateKey(),
            ChatMessage: Message,
            ChatTime: FormatMessageTime(),
            ChatType: "message",
        }));
        $("#whatsapp-openedchat-message").val("");
    } else {
        MI.Phone.Notifications.Add("fab fa-whatsapp", MI.Phone.Functions.Lang("WHATSAPP_TITLE"), MI.Phone.Functions.Lang("WHATSAPP_BLANK_MSG"), "#25D366", 1750);
    }
});

$(document).on('click', '#whatsapp-add-contact', function (e) {
    e.preventDefault();
    var chatNumber1 = OpenedChatData.number;
    MI.Phone.Animations.TopSlideDown('.phone-add-contact', 200, 0);
    document.getElementsByClassName('phone-add-contact-number-wp')[0].value = chatNumber1;
    const isDarkMode = localStorage.getItem('darkmodstored');
    if (isDarkMode != 'true') {
        MI.Phone.Functions.HeaderTextColor('black', 300)
    } else {
        MI.Phone.Functions.HeaderTextColor('white', 300)
    }
});

$(document).on('keypress', function (e) {
    if (OpenedChatData.number !== null) {
        if(e.which === 13){
            var Message = $("#whatsapp-openedchat-message").val();
    
            if (Message !== null && Message !== undefined && Message !== "") {
                $.post('http://almez-phonev2/SendMessage', JSON.stringify({
                    ChatNumber: OpenedChatData.number,
                    ChatDate: GetCurrentDateKey(),
                    ChatMessage: Message,
                    ChatTime: FormatMessageTime(),
                    ChatType: "message",
                }));
                $("#whatsapp-openedchat-message").val("");
            } else {
                MI.Phone.Notifications.Add("fab fa-whatsapp", MI.Phone.Functions.Lang("WHATSAPP_TITLE"), MI.Phone.Functions.Lang("WHATSAPP_BLANK_MSG"), "#25D366", 1750);
            }
        }
    }
});

$(document).on('click', '#send-location', function(e){
    e.preventDefault();

    $.post('http://almez-phonev2/SendMessage', JSON.stringify({
        ChatNumber: OpenedChatData.number,
        ChatDate: GetCurrentDateKey(),
        ChatMessage: "Shared Location",
        ChatTime: FormatMessageTime(),
        ChatType: "location",
    }));
});

MI.Phone.Functions.SetupChatMessages = function(cData, NewChatData) {
    if (cData) {
        OpenedChatData.number = cData.number;
        OpenedChatData.name = cData.name;
        if (OpenedChatPicture == null) {
            $.post('http://almez-phonev2/GetProfilePicture', JSON.stringify({
                number: OpenedChatData.number,
            }), function(picture){
                OpenedChatPicture = "./img/default.png";
                if (picture != "default" && picture != null) {
                    OpenedChatPicture = picture
                }
                $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
            });
        } else {
            $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
        }

        $(".whatsapp-openedchat-name").html("<p>"+cData.name+"</p>");
        $(".whatsapp-openedchat-messages").html("");

        $.each(cData.messages, function(i, chat){

            var ChatDate = FormatChatDate(chat.date);
            var ChatDiv = '<div class="whatsapp-openedchat-messages-'+i+' unique-chat"><div class="whatsapp-openedchat-date">'+ChatDate+'</div></div>';

            $(".whatsapp-openedchat-messages").append(ChatDiv);
    
            $.each(cData.messages[i].messages, function(index, message){
                var Sender = "me";
                if (message.sender !== MI.Phone.Data.PlayerData.identifier) { Sender = "other"; }
                var MessageElement
                if (message.type == "message") {
                    MessageElement = '<div class="whatsapp-openedchat-message whatsapp-openedchat-message-'+Sender+'">'+message.message+'<div class="whatsapp-openedchat-message-time">'+message.time+'</div></div><div class="clearfix"></div>'
                } else if (message.type == "location") {
                    MessageElement = '<div class="whatsapp-openedchat-message whatsapp-openedchat-message-'+Sender+' whatsapp-shared-location" data-x="'+message.data.x+'" data-y="'+message.data.y+'"><span style="font-size: 1.2vh;"><i class="fas fa-thumbtack" style="font-size: 1vh;"></i> Paylaşılan Konum</span><div class="whatsapp-openedchat-message-time">'+message.time+'</div></div><div class="clearfix"></div>'
                }
                $(".whatsapp-openedchat-messages-"+i).append(MessageElement);
            });
        });
        $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 1);

        if (OpenedChatData.name == OpenedChatData.number) {
            var chatDivBilmemNe = '<div class="whatsapp-add-new-contact-div"><p> Bu kullanıcı kişi listenizde yok </p><div class="whatsapp-unkown-buttons" id="whatsapp-block"> <p onclick="Block()">Engelle</p>  </div><div class="whatsapp-unkown-buttons" id="whatsapp-report-spam"> <p onclick="Report()">Raporla</p> </div><div class="whatsapp-unkown-buttons" id="whatsapp-add-contact"> <p>Kaydet</p> </div></div>';
            $('.whatsapp-openedchat-messages').append(chatDivBilmemNe)
        };
        $('.whatsapp-openedchat-messages').animate({
            scrollTop: 9999
        }, 1)

    } else {
        OpenedChatData.number = NewChatData.number;
        if (OpenedChatPicture == null) {
            $.post('http://almez-phonev2/GetProfilePicture', JSON.stringify({
                number: OpenedChatData.number,
            }), function(picture){
                OpenedChatPicture = "./img/default.png";
                if (picture != "default" && picture != null) {
                    OpenedChatPicture = picture
                }
                $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
            });
        }

        $(".whatsapp-openedchat-name").html("<p>"+NewChatData.name+"</p>");
        $(".whatsapp-openedchat-messages").html("");
        var NewDate = new Date();
        var NewDateMonth = NewDate.getMonth();
        var NewDateDOM = NewDate.getDate();
        var NewDateYear = NewDate.getFullYear();
        var DateString = ""+NewDateDOM+"-"+(NewDateMonth+1)+"-"+NewDateYear;
        var ChatDiv = '<div class="whatsapp-openedchat-messages-'+DateString+' unique-chat"><div class="whatsapp-openedchat-date">VANDAAG</div></div>';

        $(".whatsapp-openedchat-messages").append(ChatDiv);
    }

    $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 1);
}

function Report() {
    MI.Phone.Notifications.Add('fab fa-whatsapp', MI.Phone.Functions.Lang('WHATSAPP_TITLE'), 'Raporunuz alındı!', '#25D366', 1750)
}
function Block() {
    MI.Phone.Notifications.Add('fab fa-whatsapp', MI.Phone.Functions.Lang('WHATSAPP_TITLE'), 'Çok Yakında!', '#25D366', 1750)
}

$(document).on('click', '.whatsapp-shared-location', function(e){
    e.preventDefault();
    var messageCoords = {}
    messageCoords.x = $(this).data('x');
    messageCoords.y = $(this).data('y');

    $.post('http://almez-phonev2/SharedLocation', JSON.stringify({
        coords: messageCoords,
    }))
});

var ExtraButtonsOpen = false;

$(document).on('click', '#whatsapp-openedchat-message-extras', function(e){
    e.preventDefault();

    if (!ExtraButtonsOpen) {
        $(".whatsapp-extra-buttons").css({"display":"block"}).animate({
            left: 0+"vh"
        }, 250);
        ExtraButtonsOpen = true;
    } else {
        $(".whatsapp-extra-buttons").animate({
            left: -10+"vh"
        }, 250, function(){
            $(".whatsapp-extra-buttons").css({"display":"block"});
            ExtraButtonsOpen = false;
        });
    }
});

$(document).on('click', '.settings-div > ul > li', function (e) {
    e.preventDefault();
    var selectedchatid = $(this).attr('id');
    $('.settings-div').animate({
        top: '30vh',
        display: 'none'
    }, 500);
    if (selectedchatid == 'whatsapp-delete-chat' || selectedchatid == 'whatsapp-clear-chat') {
        $.post('http://almez-phonev2/WhatsappOptions', JSON.stringify({
            number: OpenedChatData.number,
            type: selectedchatid,
            name: OpenedChatData.name
        }));
        $.post('http://almez-phonev2/GetWhatsappChats', JSON.stringify({}), function (chats) {
            MI.Phone.Functions.LoadWhatsappChats(chats);
            $.post('http://almez-phonev2/fizzfau-inputcheck', JSON.stringify({
                input: true
            }));
            OpenedChatData.number = null;
            $('.whatsapp-chats').css({
                "display": 'block'
            });
            $('.whatsapp-chats').animate({
                left: 0 + 'vh'
            }, 200);
            $('.whatsapp-openedchat').animate({
                left: -30 + 'vh'
            }, 200, function () {
                $('.whatsapp-openedchat').css({
                    "display": 'none'
                })
            });
            OpenedChatPicture = null;
            setTimeout(() => {
                $('.settings-div').animate({
                    top: '30vh',
                    display: 'none'
                }, 500);
                $('.settings-div').css('display', 'none')
            }, 250)
        })
    };
    $('.phone-home-button').css('background-color', 'rgba(255, 255, 255, 0.75)')
});

$(document).on('click', '#whatsapp-openedchat-back', function (e) {
    e.preventDefault();
    $.post('http://almez-phonev2/GetWhatsappChats', JSON.stringify({}), function (chats) {
        MI.Phone.Functions.LoadWhatsappChats(chats)
    });

    $.post('http://almez-phonev2/fizzfau-inputcheck', JSON.stringify({
        input: true
    }));
    OpenedChatData.number = null;
    $('.whatsapp-chats').css({
        "display": 'block'
    });

    $('.whatsapp-chats').animate({
        left: 0 + 'vh'
    }, 200);
    $('.whatsapp-openedchat').animate({
        left: -30 + 'vh'
    }, 200, function () {
        $('.whatsapp-openedchat').css({
            "display": 'none'
        })
    });

    OpenedChatPicture = null;
    setTimeout(() => {
        $('.settings-div').animate({
            top: '30vh',
            display: 'none'
        }, 500);
        $('.settings-div').css('display', 'none')
    }, 250)
});

$(document).on('click', '#whatsapp-openedchat-message-settings', function (e) {
    e.preventDefault();
    $('.phone-home-button').css('background-color', 'rgba(150, 150, 150, 0.75)');
    $('.settings-div').css({
        'display': 'block'
    }).animate({
        top: '0vh'
    }, 250)
});

$(document).on('click', '.whatsapp-openedchat-picture', function (e) {
    $.post('http://almez-phonev2/fizzfau-inputcheck', JSON.stringify({
        input: false
    }))
});

var clicked2 = false;
$(document).on('click', '.whatsapp-openedchat-message img', function (e) {
    var imgsrc = $(this).attr('src');
    if (!clicked2) {
        document.getElementById('big-photo').src = imgsrc;
        $('#big-photo').fadeIn(250)
    } else {
        $('#big-photo').fadeOut(250)
    };
    clicked2 = !clicked2
});

$(document).on('click', '.whatsapp-openedchat-picture', function (e) {
    var imgsrc = $(this).attr('src');
    if (!clicked) {
        document.getElementById('big-photo').src = imgsrc;
        $('#big-photo').fadeIn(250)
    } else {
        $('#big-photo').fadeOut(250)
    };
    clicked = !clicked
});

$(document).on('click', '#whatsapp-openedchat-message-call', function (e) {
    var cData = {
        number: OpenedChatData.number,
        name: OpenedChatData.name
    };
    MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
    MI.Phone.Animations.TopSlideUp('.' + MI.Phone.Data.currentApplication + '-app', 400, -160);
    CanOpenApp = false;
    setTimeout(function () {
        MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, 'none');
        CanOpenApp = true
    }, 400);
    MI.Phone.Functions.HeaderTextColor('white', 300);
    $('#whatsapp-search-input').fadeOut(150);
    if (OpenedChatData.number !== null) {
        setTimeout(function () {
            $('.whatsapp-chats').css({
                "display": 'block'
            });

            $('.whatsapp-chats').animate({
                left: 0 + 'vh'
            }, 1);
            $('.whatsapp-openedchat').animate({
                left: -30 + 'vh'
            }, 1, function () {
                $('.whatsapp-openedchat').css({
                    "display": 'none'
                })
            });

            OpenedChatPicture = null;
            OpenedChatData.number = null
        }, 450)
    };
    MI.Phone.Data.currentApplication = null;
    setTimeout(function () {
        $.post('http://almez-phonev2/CallContact', JSON.stringify({
            ContactData: cData,
            Anonymous: MI.Phone.Data.AnonymousCall
        }), function (caller) {
            if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
                if (caller.IsOnline) {
                    if (caller.CanCall) {
                        if (!caller.InCall) {
                            if (!caller.IsAvailable) {
                                if (MI.Phone.Data.AnonymousCall) {
                                    MI.Phone.Notifications.Add('fas fa-phone-volume', MI.Phone.Functions.Lang('PHONE_TITLE'), MI.Phone.Functions.Lang('PHONE_STARTED_ANON'))
                                };
                                var profileimage = 'https://media.discordapp.net/attachments/610776060744957953/812758720626032690/unnamed.png';
                                $.post('http://almez-phonev2/getImageFromNumber', JSON.stringify({
                                    name: cData.name,
                                    number: cData.number
                                }), function (getprofileimage) {
                                    if (getprofileimage != '') {
                                        profileimage = getprofileimage
                                    };
                                    document.getElementById('outgoing-image').src = profileimage;
                                    document.getElementById('incall-image').src = profileimage
                                });

                                $('.phone-call-outgoing').css({
                                    "display": 'block'
                                });

                                $('.phone-call-incoming').css({
                                    "display": 'none'
                                });

                                $('.phone-call-ongoing').css({
                                    "display": 'none'
                                });

                                $('.phone-call-outgoing-caller').html(cData.name);
                                MI.Phone.Functions.HeaderTextColor('white', 400);
                                MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                                setTimeout(function () {
                                    $('.phone-app').css({
                                        "display": 'none'
                                    });

                                    MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                                    MI.Phone.Functions.ToggleApp('phone-call', 'block')
                                }, 450);
                                CallData.name = cData.name;
                                CallData.number = cData.number;
                                MI.Phone.Data.currentApplication = 'phone-call'
                            } else {
                                MI.Phone.Notifications.Add('fas fa-phone-volume', MI.Phone.Functions.Lang('PHONE_TITLE'), 'Ulaşılamıyor!')
                            }
                        } else {
                            MI.Phone.Notifications.Add('fas fa-phone-volume', MI.Phone.Functions.Lang('PHONE_TITLE'), MI.Phone.Functions.Lang('PHONE_BUSY'))
                        }
                    } else {
                        MI.Phone.Notifications.Add('fas fa-phone-volume', MI.Phone.Functions.Lang('PHONE_TITLE'), MI.Phone.Functions.Lang('PHONE_PERSON_TALKING'))
                    }
                } else {
                    MI.Phone.Notifications.Add('fas fa-phone-volume', MI.Phone.Functions.Lang('PHONE_TITLE'), MI.Phone.Functions.Lang('PHONE_PERSON_UNAVAILABLE'))
                }
            } else {
                MI.Phone.Notifications.Add('fas fa-phone-volume', MI.Phone.Functions.Lang('PHONE_TITLE'), MI.Phone.Functions.Lang('PHONE_YOUR_NUMBER'))
            }
        })
    }, 500)
})