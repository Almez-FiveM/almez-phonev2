MI.Phone.Settings = {};
MI.Phone.Settings.Background = "background-1";
MI.Phone.Settings.OpenedTab = null;
MI.Phone.Settings.Backgrounds = {
    'background-1': {
        label: "Standart"
    },
    'background-1-dark': {
        label: "Standart Dark"
    }
};

var PressedBackground = null;
var PressedBackgroundObject = null;
var OldBackground = null;
var IsChecked = null;
var PressedProfilePicture = null;
var PressedProfilePictureObject = null;
var OldProfilePicture = null;
var ProfilePictureIsChecked = null;

MI.Phone.Functions.LoadMetaData = function(MetaData) {
    if (MetaData.background !== null && MetaData.background !== undefined) {
        MI.Phone.Settings.Background = MetaData.background;
    } else {
        MI.Phone.Settings.Background = "background-1";
    }

    // console.log(JSON.stringify(MetaData));

    var hasCustomBackground = MI.Phone.Functions.IsBackgroundCustom();
    OldBackground = $(this).parent().find('.background-option-current');

    if (!hasCustomBackground) {
        $(".phone-background").css({"background-image":"url('/html/img/backgrounds/"+MI.Phone.Settings.Background+".png')"})
        $("#standartbackground").append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    } else {
        $(".phone-background").css({"background-image":"url('"+MI.Phone.Settings.Background+"')"});
        $("#custombackground").append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    }

    if (MetaData.profilepicture == "default") {
        $("[data-settingstab='ioskimlik']").find('.settings-tab-icon').html('<img class="profilepicture31" src="./img/default.png">');
        $("[data-settingstab='profilepicture-tab']").find('.settings-tab-icon').html('<img class="profilepicture31" style="height:7.5vh; width:7.5vh; text-align:center;" src="./img/default.png">');
        // OldBackground = $("#standartpp").parent().find('.background-option-current');
        // $("#standartpp").append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    } else {
        $("[data-settingstab='ioskimlik']").find('.settings-tab-icon').html('<img class="profilepicture31" src="'+MetaData.profilepicture+'">');
        $("[data-settingstab='profilepicture-tab']").find('.settings-tab-icon').html('<img class="profilepicture31" style="height:7.5vh; width:7.5vh; text-align:center;" src="'+MetaData.profilepicture+'">');
        // OldBackground = $("#custompp").parent().find('.background-option-current');
        // $("#custompp").append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    }
}

$(document).on('click', '.settings-app-tab', function(e){
    e.preventDefault();
    var PressedTab = $(this).data("settingstab");

    if (PressedTab == "background") {
        MI.Phone.Animations.SoldanSaga(".settings-"+PressedTab+"-tab", 1000, 100);
        MI.Phone.Settings.OpenedTab = PressedTab;
    } else if (PressedTab == "profilepicture") {
        MI.Phone.Animations.SoldanSaga(".settings-"+PressedTab+"-tab");
        MI.Phone.Settings.OpenedTab = PressedTab;

    } else if (PressedTab == "numberrecognition") {
        var checkBoxes = $(".numberrec-box");
        MI.Phone.Data.AnonymousCall = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.AnonymousCall);

        if (!MI.Phone.Data.AnonymousCall) {
            $("#numberrecognition > p").html('Closed');
        } else {
            $("#numberrecognition > p").html('Open');
        }
    }else if (PressedTab == "available") {
        var checkBoxes = $(".available-box");
        MI.Phone.Data.AnonymousCall = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.AnonymousCall);
        var b = true
        if ($("#available > p").html() == "Açık") {
            $("#available > p").html('Kapalı');
        } else {
            $("#available > p").html('Açık');
            b = false
        }
        $.post("http://qb-phone/UpdateAvailableStatus", JSON.stringify({available: b}),
            function () {
                
            }
        );
    }
});

var b = false

$(document).on('click', '#whitemode', function(e){
    e.preventDefault();
    // Event.stop(e);
    if (b === true) {
        $("#whitemode-circle").html('<i class="fas fa-check-circle"></i>');
        $("#darkmode-circle").html('<i class="far fa-circle"></i>');
        b = false;
        MI.Phone.Data.Darkmode = b
        SettingsDarkmode();
        
    }

});

$(document).on('click', '#darkmode', function(e){
    e.preventDefault();
    // Event.stop(e);
    if (b === false) {
        $("#whitemode-circle").html('<i class="far fa-circle"></i>');
        $("#darkmode-circle").html('<i class="fas fa-check-circle"></i>');
        b = true;
        MI.Phone.Data.Darkmode = b
        SettingsDarkmode();
        
    }

});



SettingsDarkmode = function() {
    if (MI.Phone.Data.Darkmode) {
        //Settings
        $(".settings-app").css({"background": "#1f1f1f"});
        $(".settings-profilepicture-tab").css({"background": "#1f1f1f"});
        $(".settings-background-tab").css({"background": "#1f1f1f"});
        $(".settings-app-tab").css({"background-color": "#474747"});
        $(".normalhr").css({"background-color": "#474747"});
        $(".uzunhr").css({"background-color": "#474747"});
        $(".settings-tab-description").css({"color": "rgb(230, 230, 230)"});
        $(".settings-tab-title").css({"color": "rgb(230, 230, 230)"});
        $(".darkmode-option-title").css({"color": "rgb(230, 230, 230)"});
        $(".settings-app-tab-header").css({"color": "rgb(230, 230, 230)"});
        $(".settings-app-header").css({"color": "rgb(230, 230, 230)"});
        $(".settings-tab-icon").css({"color": "#e74c3c"});

        $(".darkmode-options").css({"background-color": "#474747"});
        
        $(".bilgiekran").css({"background": "#1f1f1f"});
        //Advert
        $(".advert-app").css({"background": "#1f1f1f"});
        $(".advert-list").css({"background-color": "#1f1f1f", "box-shadow": "0px 0 1px .5px rgba(255, 255, 255, 0.233)"});
        $("#advert-header-text").css({"color": "white"});
        $("#advert-header-name").css({"color": "white"});
        $(".test-slet").css({"background-color": "#1f1f1f", "color": "white"});
        //Whatsapp
        $(".whatsapp-app").css({"background-image": "url('https://cdn.discordapp.com/attachments/692089489186750627/836900693503508480/97c00759d90d786d9b6096d274ad3e07.png')"});
        $(".whatsapp-openedchat").css({"background-image": "url('https://cdn.discordapp.com/attachments/692089489186750627/836900693503508480/97c00759d90d786d9b6096d274ad3e07.png')"});
        //Mail
        $(".mail-header").css({"background-color": "#1f1f1f"});
        $("#mail-header-text").css({"color": "white"});
        $(".mail").css({"background-color": "#1f1f1f"});
        $(".mail-list").css({"background-color": "#1f1f1f"});
        $(".opened-mail").css({"background": "#1f1f1f"});
        $(".opened-mail-footer").css({"background-color": "#1f1f1f", "color": "white"});
        $(".opened-mail-footer-item").css({"color": "white"});
        $(".mail-back").css({"color": "white"});
        $(".mail-content").css({"color": "white"});
        $(".mail-date").css({"color": "white"});
        $(".mail-sender").css({"color": "white"});
        $(".mail-text").css({"color": "white"});
        $(".mail-time").css({"color": "white"});
        $(".mail-image-media").css({"color": "white"});
        $("#mail-header-text").css({"color": "white"});
        $("#mail-header-mail").css({"color": "white"});
        $("#mail-header-lastsync").css({"color": "white"});
        $(".mail-subject").css({"color": "white"});
        $(".nomails").css({"color": "white"});
        //Phone
        $(".phone-app").css({"background": "#1f1f1f"});
        $(".phone-keypad").css({"background": "#1f1f1f"});
        $(".phone-recent").css({"background": "#1f1f1f"});
        $(".phone-add-contact").css({"background": "#1f1f1f"});
        $(".phone-add-contact-header").css({"color": "white"});
        $(".phone-add-contact-button").css({"color": "white"});
        $("#phone-search-icon").css({"color": "white"});
        $("#phone-plus-icon").css({"color": "white"});
        $("#phone-add-contact-name-icon").css({"color": "white"});
        $("#phone-add-contact-number-icon").css({"color": "white"});
        $("#phone-add-contact-iban-icon").css({"color": "white"});
        $(".phone-add-contact-name").css({"color": "white"});
        $(".phone-add-contact-number").css({"color": "white"});
        $(".phone-add-contact-iban").css({"color": "white"});
        $(".phone-edit-contact").css({"background": "#1f1f1f"});
        $(".phone-edit-contact-button").css({"color": "white"});
        $(".phone-edit-contact-header").css({"color": "white"});
        $(".phone-suggestedcontacts").css({"background": "#1f1f1f"});
        $(".phone-suggestedcontacts-header").css({"color": "white"});
        $(".phone-app-footer-button").css({"color": "white"});
        $(".phone-keypad-key").css({"color": "white"});
        $(".phone-keypad-header").css({"color": "white"});
        $(".phone-recent-header").css({"color": "white"});
        $(".phone-app-header").css({"color": "white"});
        $("#total-contacts").css({"color": "white"});
        $(".phone-contact").css({"background-color": "#1f1f1f", "border":".1vh solid rgba(206, 206, 206, 0.2)"});
        $(".phone-contact-action-buttons > i").css({"color": "white"});
        $("#phone-edit-contact-name-icon").css({"color": "white"});
        $("#phone-edit-contact-number-icon").css({"color": "white"});
        $("#phone-edit-contact-iban-icon").css({"color": "white"});
        $(".phone-edit-contact-name").css({"color": "white"});
        $(".phone-edit-contact-number").css({"color": "white"});
        $(".phone-edit-contact-iban").css({"color": "white"});
        $(".phone-contact-name").css({"color": "white"});
        $("#phone-keypad-input").css({"color": "white", "box-shadow": "inset 0 0 .5vh 0 rgba(255, 255, 255, 0.171"});
        //Other apps(one div)
        $(".mecano-app").css({"background": "#1f1f1f"});
        $(".polices-app").css({"background": "#1f1f1f"});
        $(".doctor-app").css({"background": "#1f1f1f"});
        $(".lawyers-app").css({"background": "#1f1f1f"});
        $(".arrests-app").css({"background": "#1f1f1f"});
        $(".taxi-app").css({"background": "#1f1f1f"});
        $(".phone-contacts").css({"background": "#1f1f1f"})
        $(".phone-contact-user").css({"background": "#1f1f1f"});
        $(".phone-recent-calls").css({"background": "#1f1f1f"});
        $(".phone-app-footer").css({"background": "#1f1f1f"});
        MI.Phone.Settings.Background = "background-1-dark";
    } else {
        //Settings
        $(".settings-app").css({"background": "rgb(230, 230, 230)"});
        $(".settings-background-tab").css({"background": "rgb(230, 230, 230)"});
        $(".settings-tab-description").css({"color": "rgba(0, 0, 0, 0.65)"});
        $(".settings-tab-title").css({"color": "#333"});
        $(".darkmode-option-title").css({"color": "#333"});
        $(".settings-app-header").css({"color": "#333"});
        $(".settings-tab-icon").css({"color": "#e67e22"});
        $(".normalhr").css({"background-color": "white"});
        $(".uzunhr").css({"background-color": "white"});
        $(".settings-profilepicture-tab").css({"background": "rgb(230, 230, 230)"});
        $(".settings-app-tab").css({"background-color": "white"});
        $(".darkmode-options").css({"background-color": "white"});
        $(".bilgiekran").css({"background": "rgb(230, 230, 230)"});
        //Advert
        $(".advert-app").css({"background": "#f2f2f2"});
        $(".advert-list").css({"background-color": "rgb(255, 255, 255)", "box-shadow": "0px 0 1px .5px rgba(0, 0, 0, 0.233)"});
        $("#advert-header-text").css({"color": "black"});
        $("#advert-header-name").css({"color": "black"});
        $(".test-slet").css({"background-color": "rgb(234, 234, 234)", "color": "black"});
        //Whatsapp
        $(".whatsapp-app").css({"background-image": "url('./img/apps/whatsapp-chat.png')"});
        $(".whatsapp-openedchat").css({"background-image": "url('./img/apps/whatsapp-chat.png')"});
        //Mail
        $(".mail-header").css({"background-color": "#f2f2f2"});
        $("#mail-header-text").css({"color": "white"});
        $(".mail").css({"background-color": "#f2f2f2"});
        $(".mail-list").css({"background-color": "#f2f2f2"});
        $(".opened-mail").css({"background": "#f2f2f2"});
        $(".opened-mail-footer").css({"background-color": "#f2f2f2", "color": "white"});
        $(".opened-mail-footer-item").css({"color": "rgb(24, 24, 24)"});
        $(".mail-back").css({"color": "rgb(24, 24, 24)"});
        $(".mail-content").css({"color": "rgb(24, 24, 24)"});
        $(".mail-date").css({"color": "rgb(24, 24, 24)"});
        $(".mail-sender").css({"color": "rgb(24, 24, 24)"});
        $(".mail-text").css({"color": "rgb(24, 24, 24)"});
        $(".mail-time").css({"color": "rgb(24, 24, 24)"});
        $(".mail-image-media").css({"color": "rgb(24, 24, 24)"});
        $("#mail-header-text").css({"color": "rgb(24, 24, 24)"});
        $("#mail-header-mail").css({"color": "rgb(24, 24, 24)"});
        $("#mail-header-lastsync").css({"color": "rgb(24, 24, 24)"});
        $(".mail-subject").css({"color": "rgb(24, 24, 24)"});
        $(".nomails").css({"color": "black"});
        //Phone
        $(".phone-app").css({"background": "rgb(230, 230, 230)"});
        $(".phone-keypad").css({"background": "rgb(230, 230, 230)"});
        $(".phone-recent").css({"background": "rgb(230, 230, 230)"});
        $(".phone-add-contact").css({"background": "rgb(230, 230, 230)"});
        $(".phone-add-contact-header").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-button").css({"color": "rgb(44,44,44)"});
        $("#phone-search-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-plus-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-add-contact-name-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-add-contact-number-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-add-contact-iban-icon").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-name").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-number").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-iban").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact").css({"background": "rgb(230, 230, 230)"});
        $(".phone-edit-contact-button").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-header").css({"color": "rgb(44,44,44)"});
        $(".phone-suggestedcontacts").css({"background": "rgb(230, 230, 230)"});
        $(".phone-suggestedcontacts-header").css({"color": "rgb(44,44,44)"});
        $(".phone-app-footer-button").css({"color": "rgb(44,44,44)"});
        $(".phone-keypad-key").css({"color": "rgb(44,44,44)"});
        $(".phone-keypad-header").css({"color": "rgb(44,44,44)"});
        $(".phone-recent-header").css({"color": "rgb(44,44,44)"});
        $(".phone-app-header").css({"color": "rgb(44,44,44)"});
        $("#total-contacts").css({"color": "rgb(44,44,44)"});
        $(".phone-contact").css({"background-color": "rgb(240, 240, 240)", "border":".1vh solid rgb(206, 206, 206)"});
        $(".phone-contact-action-buttons > i").css({"color": "rgb(44,44,44)"});
        $("#phone-edit-contact-name-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-edit-contact-number-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-edit-contact-iban-icon").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-name").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-number").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-iban").css({"color": "rgb(44,44,44)"});
        $(".phone-contact-name").css({"color": "rgb(44,44,44)"});
        $("#phone-keypad-input").css({"color": "rgb(44,44,44)", "box-shadow": "inset 0 0 .5vh 0 rgba(0, 0, 0, 0.171)"});
        //Other apps(one div)
        $(".mecano-app").css({"background": "rgb(248, 248, 248)"});
        $(".polices-app").css({"background": "rgb(248, 248, 248)"});
        $(".doctor-app").css({"background": "rgb(248, 248, 248)"});
        $(".lawyers-app").css({"background": "rgb(248, 248, 248)"});
        $(".arrests-app").css({"background": "rgb(248, 248, 248)"});
        $(".taxi-app").css({"background": "rgb(248, 248, 248)"});
        $(".phone-contacts").css({"background": "rgb(248, 248, 248)"})
        $(".phone-contact-user").css({"background": "rgb(248, 248, 248)"});
        $(".phone-recent-calls").css({"background": "rgb(248, 248, 248)"});
        $(".phone-app-footer").css({"background": "rgb(248, 248, 248)"});
        MI.Phone.Settings.Background = "background-1";
        // $(".phone-app-footer").css({"background": "rgb(248, 248, 248)"});
    }
}

$(document).on('click', '#accept-background', function(e){
    e.preventDefault();
    if(PressedBackground == "custom-background"){
        MI.Phone.Settings.Background = $(".custom-background-input").val();
    }
    
    var hasCustomBackground = MI.Phone.Functions.IsBackgroundCustom();

    if (hasCustomBackground === false) {
        MI.Phone.Notifications.Add("settings", MI.Phone.Functions.Lang("SETTINGS_TITLE"), "Arkaplan", "Değişiklikler kaydedildi.")
        MI.Phone.Animations.SagdanSola(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 1000, 100);
        $(".phone-background").css({"background-image":"url('/html/img/backgrounds/"+MI.Phone.Settings.Background+".png')"})
    } else {
        MI.Phone.Notifications.Add("settings", MI.Phone.Functions.Lang("SETTINGS_TITLE"), "Arkaplan", "Değişiklikler kaydedildi.")
        MI.Phone.Animations.SagdanSola(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 1000, 100);
        $(".phone-background").css({"background-image":"url('"+MI.Phone.Settings.Background+"')"});
    }


    $.post('http://qb-phone/SetBackground', JSON.stringify({
        background: MI.Phone.Settings.Background,
    }))
});


$(document).on('click', '#cancel-background', function(e){
    e.preventDefault();
    MI.Phone.Animations.SagdanSola(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
    setTimeout(function(){
        var hasCustomBackground = MI.Phone.Functions.IsBackgroundCustom();
        standartold = $("#standartbackground").parent().find('.background-option-current');
        customold = $("#custombackground").parent().find('.background-option-current');
    
        $(standartold).fadeOut(500, function(){
            $(standartold).remove();
        });
    
        $(customold).fadeOut(500, function(){
            $(customold).remove();
        });
    
        if (!hasCustomBackground) {
            $("#standartbackground").append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            $("#custombackground").append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
        }

    }, 500);
    PressedBackground = "background-1";
    MI.Phone.Settings.Background = PressedBackground;
    
    

    
});

MI.Phone.Functions.IsBackgroundCustom = function() {
    var retval = true;
    $.each(MI.Phone.Settings.Backgrounds, function(i, background){
        if (MI.Phone.Settings.Background == i) {
            retval = false;
        }
    });
    return retval
}

$(document).on('click', '.background-option', function(e){
    e.preventDefault();
    PressedBackground = $(this).data('background');
    PressedBackgroundObject = this;
    OldBackground = $(this).parent().find('.background-option-current');
    IsChecked = $(this).find('.background-option-current');

    if (IsChecked.length === 0) {
        if (PressedBackground != "custom-background") {
            MI.Phone.Settings.Background = PressedBackground;
            $(OldBackground).fadeOut(50, function(){
                $(OldBackground).remove();
            });

            $(PressedBackgroundObject).append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            MI.Phone.Animations.OptionUp(".background-custom");
        }
    }
});


$(document).on('click', '#accept-custom-background', function(e){
    e.preventDefault();

    
    $(OldBackground).fadeOut(50, function(){
        $(OldBackground).remove();
    });
    $(PressedBackgroundObject).append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    MI.Phone.Animations.OptionDown(".background-custom", 200, -23);
    
});

$(document).on('click', '#cancel-custom-background', function(e){
    e.preventDefault();

    MI.Phone.Animations.OptionDown(".background-custom", 200, -23);
});

// Profile Picture

$(document).on('click', '#accept-profilepicture', function(e){
    e.preventDefault();
    var ProfilePicture = MI.Phone.Data.MetaData.profilepicture;
    if (ProfilePicture === "default") {
        MI.Phone.Notifications.Add("settings", MI.Phone.Functions.Lang("SETTINGS_TITLE"), MI.Phone.Functions.Lang("POFILE_DEFAULT"))
        MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $("[data-settingstab='ioskimlik']").find('.settings-tab-icon').html('<img class="profilepicture31" src="./img/default.png">');
        $("[data-settingstab='profilepicture-tab']").find('.settings-tab-icon').html('<img class="profilepicture31" style="height:7.5vh; width:7.5vh; text-align:center;" src="./img/default.png">');
    } else {
        MI.Phone.Notifications.Add("settings", MI.Phone.Functions.Lang("SETTINGS_TITLE"), MI.Phone.Functions.Lang("PROFILE_SET"))
        MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $("[data-settingstab='ioskimlik']").find('.settings-tab-icon').html('<img class="profilepicture31" src="'+ProfilePicture+'">');
        $("[data-settingstab='profilepicture-tab']").find('.settings-tab-icon').html('<img class="profilepicture31" style="height:7.5vh; width:7.5vh; text-align:center;" src="'+ProfilePicture+'">');
    }
    $.post('http://qb-phone/UpdateProfilePicture', JSON.stringify({
        profilepicture: ProfilePicture,
    }));
});

$(document).on('click', '#profilepicture-cek', function(e){
    e.preventDefault();
    
    $.post('http://qb-phone/PostNewImage', JSON.stringify({}),
        function (url) {
            $('.custom-profilepicture-input').val(url)

        },
    );

    MI.Phone.Functions.Close();
});

$(document).on('click', '#background-cek', function(e){
    e.preventDefault();
    
    $.post('http://qb-phone/PostNewImage', JSON.stringify({}),
        function (url) {
            $('.custom-background-input').val(url)
        },
    );

    MI.Phone.Functions.Close();
});



$(document).on('click', '#accept-custom-profilepicture', function(e){
    e.preventDefault();
    MI.Phone.Data.MetaData.profilepicture = $(".custom-profilepicture-input").val();
    $(OldProfilePicture).fadeOut(50, function(){
        $(OldProfilePicture).remove();
    });
    $(PressedProfilePictureObject).append('<div class="profilepicture-option-current"><i class="fas fa-check-circle"></i></div>');
    $("[data-settingstab='profilepicture-tab']").find('.settings-tab-icon').html('<img class="profilepicture31" style="height:7.5vh; width:7.5vh; text-align:center;" src="'+MI.Phone.Data.MetaData.profilepicture+'">');
    MI.Phone.Animations.OptionDown(".profilepicture-custom");
});

$(document).on('click', '.profilepicture-option', function(e){
    e.preventDefault();
    PressedProfilePicture = $(this).data('profilepicture');
    PressedProfilePictureObject = this;
    OldProfilePicture = $(this).parent().find('.profilepicture-option-current');
    ProfilePictureIsChecked = $(this).find('.profilepicture-option-current');

    if (ProfilePictureIsChecked.length === 0) {
        if (PressedProfilePicture != "custom-profilepicture") {
            MI.Phone.Data.MetaData.profilepicture = PressedProfilePicture
            $(OldProfilePicture).fadeOut(50, function(){
                $(OldProfilePicture).remove();
            });
            
            console.log("default");
            $(PressedProfilePictureObject).append('<div class="profilepicture-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            MI.Phone.Animations.OptionUp(".profilepicture-custom");
        }
    }
});

$(document).on('click', '#cancel-profilepicture', function(e){
    e.preventDefault();
    MI.Phone.Animations.SagdanSola(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
});


$(document).on('click', '#cancel-custom-profilepicture', function(e){
    e.preventDefault();
    MI.Phone.Animations.OptionDown(".profilepicture-custom");
});