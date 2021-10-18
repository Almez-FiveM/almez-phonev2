Setuppolices = function(data) {
    $(".polices-list").html("");
    if (data.length > 0) {
        $.each(data, function(i, police){
            var element = '<div class="police-list" id="policeid-'+i+'"> <div class="police-list-firstletter">'+ '</div> <div class="police-list-fullname">' + police.firstname + " " + police.lastname + '</div> <div class="police-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".polices-list").append(element);
            $("#policeid-"+i).data('policeData', police);
        });
    } else {
        var element = '<div class="police-list"><div class="no-polices">Şuanda müsait polis yok.</div></div>'
        $(".polices-list").append(element);
    }
}

$(document).on('click', '.police-list-call', function(e){
    e.preventDefault();

    var policeData = $(this).parent().data('policeData');
    
    var cData = {
        number: policeData.phone,
        name: policeData.name
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
                            $(".polices-app").css({"display":"none"});
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