MI = {}
MI.Phone = {}
MI.Screen = {}
MI.Phone.Functions = {}
MI.Phone.Animations = {}
MI.Phone.Notifications = {}
MI.Phone.LangData = {};
MI.Phone.ContactColors = {
    0: "#9b59b6",
    1: "#3498db",
    2: "#e67e22",
    3: "#e74c3c",
    4: "#1abc9c",
    5: "#9c88ff",
}

$(".solitary-app").hide()

MI.Phone.Data = {
    currentApplication: null,
    PlayerData: {},
    Applications: {},
    IsOpen: false,
    CallActive: false,
    MetaData: {},
    PlayerJob: {},
    AnonymousCall: false,
    Darkmode: false,
    Sound: true
}

OpenedChatData = {
    number: null,
}

var CanOpenApp = true;

function IsAppJobBlocked(joblist, myjob) {
    var retval = false;
    if (joblist.length > 0) {
        $.each(joblist, function(i, job){
            if (job == myjob) {
                retval = true;
            }
        });
    }
    return retval;
}

MI.Phone.Functions.SetupApplications = function(data) {
    MI.Phone.Data.Applications = data.applications;
    $.each(data.applications, function(i, app){
        //console.log(app.tooltipText)
        var applicationSlot = $(".phone-applications").find('[data-appslot="'+app.slot+'"]');
        var blockedapp = IsAppJobBlocked(app.blockedjobs, MI.Phone.Data.PlayerJob.name)
        $(applicationSlot).html("");
        $(applicationSlot).css({"background-color":"transparent"});
        $(applicationSlot).prop('title', "");
        $(applicationSlot).removeData('app');
        if (app.tooltipPos !== undefined) {
            $(applicationSlot).removeData('placement')
        }
        if (app.app != 'darkweb') {
            if ((!app.job || app.job === MI.Phone.Data.PlayerJob.name) && !blockedapp) {
                $(applicationSlot).css({"background-color":app.color});
                var icon = '<img src="./img/icons/'+app.icon+'.png" style="margin-left:-1.5px;width: 48px; height: 48px; padding: 1px;">';
                var str = app.icon
                var iconnil = str.startsWith("fa")
                if (iconnil) {
                    icon = '<i class="ApplicationIcon '+ app.icon +'" style="'+app.style+'"></i>';
                }

                if (!iconnil) {
                    $(applicationSlot).css({"background-color":"transparent"});
                }
                if (app.app == "meos") {
                    icon = '<img src="./img/politie.png" class="police-icon">';
                }
                $(applicationSlot).html(icon);
                $(applicationSlot).prop('title', app.tooltipText);
                $(applicationSlot).data('app', app.app);

                if (app.tooltipPos !== undefined) {
                    $(applicationSlot).data('placement', app.tooltipPos)
                }
            }
        } else {
            if (data.vpn) {
                $(applicationSlot).css({"background-color":app.color});
                var icon = '<i class="ApplicationIcon '+ app.icon +'" style="'+app.style+'"></i>';
                $(applicationSlot).html(icon);
                $(applicationSlot).prop('title', app.tooltipText);
                $(applicationSlot).data('app', app.app);

                if (app.tooltipPos !== undefined) {
                    $(applicationSlot).data('placement', app.tooltipPos)
                }
            }
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
}

MI.Phone.Functions.SetupAppWarnings = function(AppData) {
    $.each(AppData, function(i, app){
        var AppObject = $(".phone-applications").find("[data-appslot='"+app.slot+"']").find('.app-unread-alerts');

        if (app.Alerts > 0) {
            $(AppObject).html(app.Alerts);
            $(AppObject).css({"display":"block"});
        } else {
            $(AppObject).css({"display":"none"});
        }
    });
}

MI.Phone.Functions.IsAppHeaderAllowed = function(app) {
    var retval = true;
    $.each(Config.HeaderDisabledApps, function(i, blocked){
        if (app == blocked) {
            retval = false;
        }
    });
    return retval;
}

$(document).on('click', '.phone-application', function(e){
    e.preventDefault();
    var PressedApplication = $(this).data('app');
    var AppObject = $("."+PressedApplication+"-app");
    // console.log(PressedApplication)
    if (AppObject.length !== 0) {
        if (CanOpenApp) {
            if (MI.Phone.Data.currentApplication == null) {
                MI.Phone.Animations.TopSlideDown('.phone-application-container', 300, 0);
                MI.Phone.Functions.ToggleApp(PressedApplication, "block");
                
                if (MI.Phone.Functions.IsAppHeaderAllowed(PressedApplication) && !PressedApplication == 'twitter' && !PressedApplication == 'spotify' && !PressedApplication == 'dungeon') {
                    MI.Phone.Functions.HeaderTextColor("black", 300);
                }
    
                MI.Phone.Data.currentApplication = PressedApplication;
    
                if (PressedApplication == "settings") {
                    $("#myPhoneNumber").text(MI.Phone.Data.PhoneNumber)
                } else if (PressedApplication == "twitter") {
                    $.post('http://almez-phonev2/GetMentionedTweets', JSON.stringify({}), function(MentionedTweets){
                        MI.Phone.Notifications.LoadMentionedTweets(MentionedTweets)
                    })
                    $.post('http://almez-phonev2/GetHashtags', JSON.stringify({}), function(Hashtags){
                        MI.Phone.Notifications.LoadHashtags(Hashtags)
                    })
                    $.post('http://almez-phonev2/GetSelfTweets', JSON.stringify({}), function (selfTweets) {
                        MI.Phone.Notifications.LoadSelfTweets(selfTweets)
                    })
                    if (MI.Phone.Data.IsOpen) {
                        $.post('http://almez-phonev2/GetTweets', JSON.stringify({}), function(Tweets){
                            MI.Phone.Notifications.LoadTweets(Tweets);
                        });
                    }
                    
                    MI.Phone.Functions.HeaderTextColor("white", 300);

                } else if (PressedApplication == "spotify") {
                    MI.Phone.Functions.HeaderTextColor("black", 300);
                } else if (PressedApplication == "dungeon") {
                    MI.Phone.Functions.HeaderTextColor("black", 300);
                } else if (PressedApplication == "bank") {
                    if (MI.Phone.Data.IsRealOwner == true) {
                            $.post('http://almez-phonev2/GetBankData', JSON.stringify({}), function(data){
                            MI.Phone.Functions.DoBankOpen(data);
                            MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), "Parmak izi doğrulandı.", "#badc58", 1500);
                        });
                    }
                    else if (MI.Phone.Data.IsRealOwner !== true) {
                        MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), "Parmak izi doğrulanmadı.", "#FF0000", 3000);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
                        CanOpenApp = false;
                        setTimeout(function(){
                            MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
                            CanOpenApp = true;
                        }, 400)
                        MI.Phone.Functions.HeaderTextColor("white", 300);
                        MI.Phone.Data.currentApplication = null;
                    }
                    $.post('http://almez-phonev2/GetBankContacts', JSON.stringify({}), function(contacts){
                        MI.Phone.Functions.LoadContactsWithNumber(contacts);
                    });
                    $.post('http://almez-phonev2/GetInvoices', JSON.stringify({}), function(invoices){
                        MI.Phone.Functions.LoadBankInvoices(invoices);
                    });
                } else if (PressedApplication == "whatsapp") {
                    $.post('http://almez-phonev2/GetWhatsappChats', JSON.stringify({}), function(chats){
                        MI.Phone.Functions.LoadWhatsappChats(chats);
                    });
                } else if (PressedApplication == "phone") {
                    $.post('http://almez-phonev2/GetMissedCalls', JSON.stringify({}), function(recent){
                        MI.Phone.Functions.SetupRecentCalls(recent);
                    });
                    $.post('http://almez-phonev2/GetSuggestedContacts', JSON.stringify({}), function(suggested){
                        MI.Phone.Functions.SetupSuggestedContacts(suggested);
                    });
                    $.post('http://almez-phonev2/ClearGeneralAlerts', JSON.stringify({
                        app: "phone"
                    }));
                } else if (PressedApplication == "mail") {
                    $.post('http://almez-phonev2/GetMails', JSON.stringify({}), function(mails){
                        MI.Phone.Functions.SetupMails(mails);
                    });
                    $.post('http://almez-phonev2/ClearGeneralAlerts', JSON.stringify({
                        app: "mail"
                    }));
                } else if (PressedApplication == "advert") {
                    $.post('http://almez-phonev2/LoadAdverts', JSON.stringify({}), function(Adverts){
                        MI.Phone.Functions.RefreshAdverts(Adverts);
                    })
                } else if (PressedApplication == "garage") {
                    $.post('http://almez-phonev2/SetupGarageVehicles', JSON.stringify({}), function(Vehicles){
                        SetupGarageVehicles(Vehicles);
                    })
                } else if (PressedApplication == "crypto") {
                    $.post('http://almez-phonev2/GetCryptoData', JSON.stringify({
                        crypto: "qbit",
                    }), function(CryptoData){
                        SetupCryptoData(CryptoData);
                    })

                    $.post('http://almez-phonev2/GetCryptoTransactions', JSON.stringify({}), function(data){
                        RefreshCryptoTransactions(data);
                    })
                } else if (PressedApplication == "racing") {
                    $.post('http://almez-phonev2/GetAvailableRaces', JSON.stringify({}), function(Races){
                        SetupRaces(Races);
                    });
                } else if (PressedApplication == "houses") {
                    $.post('http://almez-phonev2/GetPlayerHouses', JSON.stringify({}), function(Houses){
                        SetupPlayerHouses(Houses);
                    });
                } else if (PressedApplication == "meos") {
                    SetupMeosHome();
                }  else if (PressedApplication == "lawyers") {
                    $.post('http://almez-phonev2/GetCurrentLawyers', JSON.stringify({}), function(data){
                        SetupLawyers(data);
                    });
                } else if (PressedApplication == "doctor") {
                    $.post('http://almez-phonev2/GetCurrentDoctor', JSON.stringify({}), function(data){
                        SetupDoctor(data);
                    });
                } else if (PressedApplication == "taxi") {
                    $.post('http://almez-phonev2/GetCurrentDrivers', JSON.stringify({}), function(data){
                        SetupDrivers(data);
                    });
                } else if (PressedApplication == "arrests") {
                    $.post('http://almez-phonev2/GetCurrentArrests', JSON.stringify({}), function(data){
                        SetupArrests(data);
                    });
                } else if (PressedApplication == "darkweb") {
                    $.post('http://almez-phonev2/DarkwebList', JSON.stringify({}), function(data){
                        SetupDarkweb(data);
                    });
                } else if (PressedApplication == "mecano") {
                    $.post('http://almez-phonev2/GetCurrentMecano', JSON.stringify({}), function(data){
                        SetupMecano(data);
                    });	
                } else if (PressedApplication == "clock") {
                    $.post('http://almez-phonev2/GetAlarmData', JSON.stringify({}), function(data){
                        MI.Phone.Functions.DoclockOpen(data);
                    });	
                } else if (PressedApplication == "weazel") {
                    $.post('http://almez-phonev2/GetCurrentWeazel', JSON.stringify({}), function(data){
                        SetupWeazel(data);
                    });	
                } else if (PressedApplication == "food") {
                    $.post('http://almez-phonev2/GetCurrentFoodCompany', JSON.stringify({}), function(data){
                        SetupFood(data);
                    });	
                } else if (PressedApplication == "jobs") {
                    $.post('http://almez-phonev2/GetCurrentJobsCompany', JSON.stringify({}), function(data){
                        SetupJobs(data);
                    });	
                } else if (PressedApplication == "polices") {
                        $.post('http://almez-phonev2/GetCurrentpolices', JSON.stringify({}), function(data){
                            Setuppolices(data);
                        });					
                    } 
                }
            
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-exclamation-circle", MI.Phone.Functions.Lang("NUI_SYSTEM"), MI.Phone.Data.Applications[PressedApplication].tooltipText+" "+MI.Phone.Functions.Lang("NUI_NOT_AVAILABLE"))
    }
    
});

$(document).on('click', '.phone-home-container', function(event){
    event.preventDefault();

    if (MI.Phone.Data.currentApplication === null) {
        MI.Phone.Functions.Close();
    } else {
        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
        MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
        CanOpenApp = false;
        setTimeout(function(){
            MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
            CanOpenApp = true;
        }, 400)
        MI.Phone.Functions.HeaderTextColor("white", 300);

        if (MI.Phone.Data.currentApplication == "whatsapp") {
            if (OpenedChatData.number !== null) {
                setTimeout(function(){
                    $(".whatsapp-chats").css({"display":"block"});
                    $(".whatsapp-chats").animate({
                        left: 0+"vh"
                    }, 1);
                    $(".whatsapp-openedchat").animate({
                        left: -30+"vh"
                    }, 1, function(){
                        $(".whatsapp-openedchat").css({"display":"none"});
                    });
                    OpenedChatPicture = null;
                    OpenedChatData.number = null;
                }, 450);
            }
        } else if (MI.Phone.Data.currentApplication == "bank") {
            if (CurrentTab == "invoices") {
                setTimeout(function(){
                    $(".bank-app-invoices").animate({"left": "30vh"});
                    $(".bank-app-invoices").css({"display":"none"})
                    $(".bank-app-accounts").css({"display":"block"})
                    $(".bank-app-accounts").css({"left": "0vh"});
    
                    var InvoicesObjectBank = $(".bank-app-header").find('[data-headertype="invoices"]');
                    var HomeObjectBank = $(".bank-app-header").find('[data-headertype="accounts"]');
    
                    $(InvoicesObjectBank).removeClass('bank-app-header-button-selected');
                    $(HomeObjectBank).addClass('bank-app-header-button-selected');
    
                    CurrentTab = "accounts";
                }, 400)
            }
        } else if (MI.Phone.Data.currentApplication == "meos") {
            $(".meos-alert-new").remove();
            setTimeout(function(){
                $(".meos-recent-alert").removeClass("noodknop");
                $(".meos-recent-alert").css({"background-color":"#004682"}); 
            }, 400)
        }

        MI.Phone.Data.currentApplication = null;
    }
});

$(document).on('click', '.phone-home-container2', function(event){
    event.preventDefault();
        MI.Phone.Functions.Close();
});

$(document).on('click', '.phone-home-container3', function (e) {
    e.preventDefault();
    $.post('http://almez-phonev2/KameraAc', JSON.stringify({}),);
    MI.Phone.Functions.Close();
});

MI.Phone.Functions.Open = function(data) {
    MI.Phone.Animations.BottomSlideUp('.container', 300, 0);
    MI.Phone.Notifications.LoadTweets(data.Tweets);
    MI.Phone.Data.IsOpen = true;
}

MI.Phone.Functions.ToggleApp = function(app, show) {
    $("."+app+"-app").css({"display":show});
}

MI.Phone.Functions.Close = function() {

    if (MI.Phone.Data.currentApplication == "whatsapp") {
        setTimeout(function(){
            MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
            MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
            $(".whatsapp-app").css({"display":"none"});
            MI.Phone.Functions.HeaderTextColor("white", 300);
    
            if (OpenedChatData.number !== null) {
                setTimeout(function(){
                    $(".whatsapp-chats").css({"display":"block"});
                    $(".whatsapp-chats").animate({
                        left: 0+"vh"
                    }, 1);
                    $(".whatsapp-openedchat").animate({
                        left: -30+"vh"
                    }, 1, function(){
                        $(".whatsapp-openedchat").css({"display":"none"});
                    });
                    OpenedChatData.number = null;
                }, 450);
            }
            OpenedChatPicture = null;
            MI.Phone.Data.currentApplication = null;
        }, 500)
    } else if (MI.Phone.Data.currentApplication == "meos") {
        $(".meos-alert-new").remove();
        $(".meos-recent-alert").removeClass("noodknop");
        $(".meos-recent-alert").css({"background-color":"#004682"}); 
    }

    MI.Phone.Animations.BottomSlideDown('.container', 300, -70);
    $.post('http://almez-phonev2/Close');
    MI.Phone.Data.IsOpen = false;
    for(let i = 0; i < photos.length; i++){
        photos[i].remove()
    }
     clicked = false;

}

MI.Phone.Functions.HeaderTextColor = function(newColor, Timeout) {
    $(".phone-header").animate({color: newColor}, Timeout);
}

MI.Phone.Animations.PhoneUp = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        bottom: Percentage+"%",
    }, Timeout);
}

MI.Phone.Animations.PhoneDown = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        bottom: Percentage+"%",
    }, Timeout, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.NotifDown = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, Timeout);
}

MI.Phone.Animations.NotifUp = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, Timeout, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.BottomSlideUp = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        bottom: Percentage+"%",
    }, Timeout);
}

MI.Phone.Animations.BottomSlideDown = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        bottom: Percentage+"%",
    }, Timeout, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.TopSlideUp = function(Object, cb) {
    $(Object).css({'top':'100%'});
    $(Object).css({'display':'block'}).animate({
        opacity: "0%",
    }, 500, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.OptionUp = function(Object, cb) {
    $(Object).css({'top':'62vh'});
    $(Object).css({'display':'block'}).animate({
        top: "40vh",
    }, 350);
}

MI.Phone.Animations.OptionDown = function(Object, cb) {
    $(Object).css({'top':'40vh'});
    $(Object).css({'display':'block'}).animate({
        top: "62vh",
    }, 350, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.FadeIn = function(Object) {
    $(Object).css({'opacity':'0%'});
    $(Object).css({'top':'0'});
    // $(Object).css({'display':'block'});
    $(Object).css({'display':'block'}).animate({
        opacity: "100%",
    }, 500);
}

MI.Phone.Animations.FadeInSettings = function(Object) {
    $(Object).css({'opacity':'0%'});
    $(Object).css({'top':'30vh'});
    // $(Object).css({'display':'block'});
    $(Object).css({'display':'block'}).animate({
        opacity: "100%",
    }, 500);
}

MI.Phone.Animations.SoldanSaga = function(Object) {
    $(Object).css({'opacity':'100%'});
    $(Object).css({'left':'100%'});
    $(Object).css({'top':'0'});
    $(Object).css({'display':'block'}).animate({
        left: "0",
    }, 300);
}

MI.Phone.Animations.SagdanSola = function(Object) {
    $(Object).css({'opacity':'100%'});
    $(Object).css({'left':'0'});
    $(Object).css({'top':'0'});
    $(Object).css({'display':'block'}).animate({
        left: "100%",
    }, 300, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.FadeOut = function(Object) {
    $(Object).css({'opacity':'100%'});
    $(Object).css({'top':'0'});
    $(Object).css({'display':'block'}).animate({
        opacity: "0%",
    }, 500, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.TopSlideDown = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, Timeout);
}


MI.Phone.Notifications.Add = function(icon, title, text, color, timeout) {
    $.post('http://almez-phonev2/HasPhone', JSON.stringify({}), function(HasPhone){
        if (HasPhone) {
            if (timeout == null && timeout == undefined) {
                timeout = 1500;
            }
            if (MI.Phone.Notifications.Timeout == undefined || MI.Phone.Notifications.Timeout == null) {
                if (color != null || color != undefined) {
                    $(".notification-icon").css({"color":color});
                    $(".notification-title").css({"color":color});
                } else if (color == "default" || color == null || color == undefined) {                    
                    $(".notification-icon").css({"color":"#e74c3c"});
                    $(".notification-title").css({"color":"#e74c3c"});
                }
                MI.Phone.Animations.TopSlideDown(".phone-notification-container", 200, 8);
                if (icon !== "politie") {
                    $(".notification-icon").html('<i class="'+icon+'"></i>');
                } else {
                    $(".notification-icon").html('<img src="./img/politie.png" class="police-icon-notify">');
                }
                $(".notification-title").html(title);
                $(".notification-text").html(text);
                if (MI.Phone.Notifications.Timeout !== undefined || MI.Phone.Notifications.Timeout !== null) {
                    clearTimeout(MI.Phone.Notifications.Timeout);
                }
                MI.Phone.Notifications.Timeout = setTimeout(function(){
                    MI.Phone.Animations.TopSlideUp(".phone-notification-container", 200, -8);
                    MI.Phone.Notifications.Timeout = null;
                }, timeout);
            } else {
                if (color != null || color != undefined) {
                    $(".notification-icon").css({"color":color});
                    $(".notification-title").css({"color":color});
                } else {
                    $(".notification-icon").css({"color":"#e74c3c"});
                    $(".notification-title").css({"color":"#e74c3c"});
                }
                $(".notification-icon").html('<i class="'+icon+'"></i>');
                $(".notification-title").html(title);
                $(".notification-text").html(text);
                if (MI.Phone.Notifications.Timeout !== undefined || MI.Phone.Notifications.Timeout !== null) {
                    clearTimeout(MI.Phone.Notifications.Timeout);
                }
                MI.Phone.Notifications.Timeout = setTimeout(function(){
                    MI.Phone.Animations.TopSlideUp(".phone-notification-container", 200, -8);
                    MI.Phone.Notifications.Timeout = null;
                }, timeout);
            }
        }
    });
}

MI.Phone.Functions.LoadPhoneData = function(data) {
    MI.Phone.Data.PlayerData = data.PlayerData;
    MI.Phone.Data.PlayerJob = data.PlayerJob;
    MI.Phone.Data.MetaData = data.PhoneData.MetaData;


    MI.Phone.Data.PhoneNumber = data.PhoneData.PhoneNumber
    MI.Phone.Data.Owner = data.PhoneData.PhoneNumber
    
    MI.Phone.Functions.LoadMetaData(data.PhoneData.MetaData);
    MI.Phone.Functions.LoadContacts(data.PhoneData.Contacts);
    MI.Phone.Functions.SetupApplications(data);
    console.log("Phone succesfully loaded!");

    $.post('http://almez-phonev2/GetLangData', JSON.stringify({}), function(langs){
        MI.Phone.LangData = langs.table[langs.current];
    });
}

MI.Phone.Functions.Lang = function(item) {    
    if (MI.Phone.LangData[item]) {
        return MI.Phone.LangData[item];
    } else {
        return item;
    }
}

MI.Phone.Functions.UpdateTime = function(data) {  
    var NewDate = new Date();
    var NewHour = NewDate.getHours();
    var NewMinute = NewDate.getMinutes();
    var Minutes = NewMinute;
    var Hours = NewHour;
    if (NewHour < 10) {
        Hours = "0" + Hours;
    }
    if (NewMinute < 10) {
        Minutessss = "0" + NewMinute;
    }
    var Time = Hours + ":" + Minutes
    $("#html-id").html(Time);
}

var NotificationTimeout = null;

MI.Screen.Notification = function(title, content, icon, timeout, color) {
    $.post('http://almez-phonev2/HasPhone', JSON.stringify({}), function(HasPhone){
        if (HasPhone) {
            if (color != null && color != undefined) {
                $(".screen-notifications-container").css({"background-color":color});
            }
            $(".screen-notification-icon").html('<i class="'+icon+'"></i>');
            $(".screen-notification-title").text(title);
            $(".screen-notification-content").text(content);
            $(".screen-notifications-container").css({'display':'block'}).animate({
                right: 5+"vh",
            }, 200);
        
            if (NotificationTimeout != null) {
                clearTimeout(NotificationTimeout);
            }
        
            NotificationTimeout = setTimeout(function(){
                $(".screen-notifications-container").animate({
                    right: -35+"vh",
                }, 200, function(){
                    $(".screen-notifications-container").css({'display':'none'});
                });
                NotificationTimeout = null;
            }, timeout);
        }
    });
}


$(document).ready(function(){
    $( "*" ).on("input", function(){
        $.post('http://almez-phonev2/disableControls', JSON.stringify({}))
    });

    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "open":
                MI.Phone.Functions.Open(event.data);
                MI.Phone.Functions.SetupAppWarnings(event.data.AppData);
                MI.Phone.Functions.SetupCurrentCall(event.data.CallData);
                MI.Phone.Data.IsOpen = true;
                MI.Phone.Data.PlayerData = event.data.PlayerData;
                break;
            case "darkwebForceClose":
                MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
                CanOpenApp = false;
                setTimeout(function(){
                    MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
                    CanOpenApp = true;
                }, 400)
                MI.Phone.Functions.HeaderTextColor("white", 300);
                MI.Phone.Data.currentApplication = null;
                break;
            case "LoadPhoneData":
                MI.Phone.Functions.LoadPhoneData(event.data);
                break;
            case "UpdateTime":
                MI.Phone.Functions.UpdateTime(event.data);
                break;
            case "NotRealowner":
                MI.Phone.Data.IsRealOwner = false;
                break;
            case "Realowner":
                MI.Phone.Data.IsRealOwner = true;
                break;
            case "updateTest":
                MI.Phone.Notifications.LoadSelfTweets(event.data.selfTweets)
                break;
            case "updateTweets":
                MI.Phone.Notifications.LoadTweets(event.data.tweets)
                MI.Phone.Notifications.LoadSelfTweets(event.data.selfTweets)
                break;
            case "Notification":
                MI.Screen.Notification(event.data.NotifyData.title, event.data.NotifyData.content, event.data.NotifyData.icon, event.data.NotifyData.timeout, event.data.NotifyData.color);
                break;
            case "PhoneNotification":
                MI.Phone.Notifications.Add(event.data.PhoneNotify.icon, event.data.PhoneNotify.title, event.data.PhoneNotify.text, event.data.PhoneNotify.color, event.data.PhoneNotify.timeout);
                break;
            case "RefreshAppAlerts":
                MI.Phone.Functions.SetupAppWarnings(event.data.AppData);                
                break;
            case "UpdateMentionedTweets":
                MI.Phone.Notifications.LoadMentionedTweets(event.data.Tweets);                
                break;
            case "UpdateBank":
                $(".bank-app-account-balance").html("&euro; "+event.data.NewBalance);
                $(".bank-app-account-balance").data('balance', event.data.NewBalance);
                break;
            case "UpdateChat":
                if (MI.Phone.Data.currentApplication == "whatsapp") {
                    if (OpenedChatData.number !== null && OpenedChatData.number == event.data.chatNumber) {
                        // console.log('Chat reloaded')
                        MI.Phone.Functions.SetupChatMessages(event.data.chatData);
                    } else {
                        // console.log('Chats reloaded')
                        MI.Phone.Functions.LoadWhatsappChats(event.data.Chats);
                    }
                }
                break;
            case "UpdateHashtags":
                MI.Phone.Notifications.LoadHashtags(event.data.Hashtags);
                break;
            case "RefreshWhatsappAlerts":
                MI.Phone.Functions.ReloadWhatsappAlerts(event.data.Chats);
                break;
            case "CancelOutgoingCall":
                $.post('http://almez-phonev2/HasPhone', JSON.stringify({}), function(HasPhone){
                    if (HasPhone) {
                        CancelOutgoingCall();
                    }
                });
                break;
            case "IncomingCallAlert":
                $.post('http://almez-phonev2/HasPhone', JSON.stringify({}), function(HasPhone){
                    if (HasPhone) {
                        IncomingCallAlert(event.data.CallData, event.data.Canceled, event.data.AnonymousCall);
                    }
                });
                break;
            case "SetupHomeCall":
                MI.Phone.Functions.SetupCurrentCall(event.data.CallData);
                break;
            case "AnswerCall":
                MI.Phone.Functions.AnswerCall(event.data.CallData);
                break;
            case "UpdateCallTime":
                var CallTime = event.data.Time;
                var date = new Date(null);
                date.setSeconds(CallTime);
                var timeString = date.toISOString().substr(11, 8);

                if (!MI.Phone.Data.IsOpen) {
                    if ($(".call-notifications").css("right") !== "52.1px") {
                        $(".call-notifications").css({"display":"block"});
                        $(".call-notifications").animate({right: 5+"vh"});
                    }
                    $(".call-notifications-title").html("Süren arama ("+timeString+")");
                    $(".call-notifications-content").html("Şu kişiyle "+event.data.Name);
                    $(".call-notifications").removeClass('call-notifications-shake');
                } else {
                    $(".call-notifications").animate({
                        right: -35+"vh"
                    }, 400, function(){
                        $(".call-notifications").css({"display":"none"});
                    });
                }

                $(".phone-call-ongoing-time").html(timeString);
                $(".phone-currentcall-title").html("In gesprek ("+timeString+")");
                break;
            case "CancelOngoingCall":
                $(".call-notifications").animate({right: -35+"vh"}, function(){
                    $(".call-notifications").css({"display":"none"});
                });
                MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                setTimeout(function(){
                    MI.Phone.Functions.ToggleApp("phone-call", "none");
                    $(".phone-application-container").css({"display":"none"});
                }, 400)
                MI.Phone.Functions.HeaderTextColor("white", 300);
    
                MI.Phone.Data.CallActive = false;
                MI.Phone.Data.currentApplication = null;
                break;
            case "RefreshContacts":
                MI.Phone.Functions.LoadContacts(event.data.Contacts);
                break;
            case "UpdateMails":
                MI.Phone.Functions.SetupMails(event.data.Mails);
                break;
            case "RefreshAdverts":
                if (MI.Phone.Data.currentApplication == "advert") {
                    MI.Phone.Functions.RefreshAdverts(event.data.Adverts);
                }
                break;
            case "AddPoliceAlert":
                AddPoliceAlert(event.data)
                break;
            case "UpdateApplications":
                MI.Phone.Data.PlayerJob = event.data.JobData;
                MI.Phone.Functions.SetupApplications(event.data);
                break;
            case "UpdateTransactions":
                RefreshCryptoTransactions(event.data);
                break;
            case "UpdateRacingApp":
                $.post('http://almez-phonev2/GetAvailableRaces', JSON.stringify({}), function(Races){
                    SetupRaces(Races);
                });
                break;
        }
    })
});

$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27: // ESCAPE
            MI.Phone.Functions.Close();

            break;
    }
});