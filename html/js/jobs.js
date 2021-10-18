SetupJobs = function(data) {
    $(".jobs2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, jobs){
            var element = '<div class="jobs-list" id="jobsid-'+i+'"> <div class="jobs-list-firstletter">' + '<img src="img/' + jobs.setjob + '.png"' + 'width="50vh" height="50vh" style="border-radius:50%">' + '</div> <div class="jobs-list-fullname">' + jobs.name + '</div> <div class="jobs-list-company"><i class="fas fa-arrow-circle-right"></i></div> </div>'
            $(".jobs2-list").append(element);
            $("#jobsid-"+i).data('jobsData', jobs);
        });
    } else {
        var element = '<div class="jobs-list"><div class="no-jobs">Şuanda müsait restorant yok..</div></div> <div class="jobs-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
        $(".jobs2-list").append(element);
    }
}

$(document).on('click', '.jobs-list-back', function(e){
    $.post('http://almez-phonev2/GetCurrentJobsCompany', JSON.stringify({}), function(data){
        SetupJobs(data);
    });	
});

$(document).on('click', '.jobs-list-company', function(e){
    var jobsData = $(this).parent().data('jobsData');

    $.post('http://almez-phonev2/GetCurrentJobsWorker', JSON.stringify({
        JobsJob: jobsData.setjob,
    }), function(status){
        $(".jobs2-list").html("");
        if (status.length > 0) {
            $.each(status, function(i, jobs){
                console.log(jobs)
                var element = '<div class="jobs-list" id="jobsid-'+i+'"> <div class="jobs-list-firstletter-worker">' + (jobs.name).charAt(0).toUpperCase() + '</div><div class="jobs-list-fullname">' + jobs.name + '</div> <div class="jobs-list-call"><i class="fas fa-phone"></i></div> </div>'
                $(".jobs2-list").append(element);
                $("#jobsid-"+i).data('jobsData', jobs);
            });
            var back = '<div class="jobs-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
            $(".jobs2-list").append(back);
        } else {
            console.log("calismiyom")
            var element = '<div class="jobs-list"><div class="no-jobs">Aktif bir birim yok.</div></div> <div class="jobs-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
            $(".jobs2-list").append(element);
        }
    });
});

$(document).on('click', '.jobs-list-call', function(e){
    e.preventDefault();

    var jobsData = $(this).parent().data('jobsData');
    
    var cData = {
        number: jobsData.phone,
        name: jobsData.name
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
                            $(".jobs-app").css({"display":"none"});
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
