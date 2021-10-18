SetupFood = function(data) {
    $(".food2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, food){
            var element = '<div class="food-list" id="foodid-'+i+'"> <div class="food-list-firstletter">' + '<img src="img/' + food.setjob + '.png"' + 'width="50vh" height="50vh" style="border-radius:50%">' + '</div> <div class="food-list-fullname">' + food.name + '</div> <div class="food-list-company"><i class="fas fa-arrow-circle-right"></i></div> </div>'
            $(".food2-list").append(element);
            $("#foodid-"+i).data('foodData', food);
        });
    } else {
        var element = '<div class="food-list"><div class="no-food">Şuanda müsait restorant yok..</div></div> <div class="food-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
        $(".food2-list").append(element);
    }
}

$(document).on('click', '.food-list-back', function(e){
    $.post('http://almez-phonev2/GetCurrentFoodCompany', JSON.stringify({}), function(data){
        SetupFood(data);
    });	
});

$(document).on('click', '.food-list-company', function(e){
    var foodData = $(this).parent().data('foodData');

    $.post('http://almez-phonev2/GetCurrentFoodWorker', JSON.stringify({
        FoodJob: foodData.setjob,
    }), function(status){
        $(".food2-list").html("");
        if (status.length > 0) {
            $.each(status, function(i, food){
                console.log(food)
                var element = '<div class="food-list" id="foodid-'+i+'"> <div class="food-list-firstletter-worker">' + (food.name).charAt(0).toUpperCase() + '</div><div class="food-list-fullname">' + food.name + '</div> <div class="food-list-call"><i class="fas fa-phone"></i></div> </div>'
                $(".food2-list").append(element);
                $("#foodid-"+i).data('foodData', food);
            });
            var back = '<div class="food-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
            $(".food2-list").append(back);
        } else {
            console.log("calismiyom")
            var element = '<div class="food-list"><div class="no-food">Bu restoran şu anda hizmet vermiyor...</div></div> <div class="food-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
            $(".food2-list").append(element);
        }
    });
});

$(document).on('click', '.food-list-call', function(e){
    e.preventDefault();

    var foodData = $(this).parent().data('foodData');
    
    var cData = {
        number: foodData.phone,
        name: foodData.name
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
                            $(".food-app").css({"display":"none"});
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
