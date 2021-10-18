SetupMecano = function(data) {
    $(".mecano2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, mecano){
            var element = '<div class="mecano-list" id="mecanoid-'+i+'"> <div class="mecano-list-firstletter">'+ '</div> <div class="mecano-list-fullname">' + mecano.firstname + " " + mecano.lastname + '</div> <div class="mecano-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".mecano2-list").append(element);
            $("#mecanoid-"+i).data('mecanoData', mecano);
        });
    } else {
        var element = '<div class="mecano-list"><div class="no-mecano">Şuanda müsait mekanik yok..</div></div>'
        $(".mecano2-list").append(element);
    }
}

$(document).on('click', '.mecano-list-call', function(e){
    e.preventDefault();

    var mecanoData = $(this).parent().data('mecanoData');
    
    var cData = {
        number: mecanoData.phone,
        name: mecanoData.name
    }

    $.post('http://almez-phonev2/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".mecano-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});
