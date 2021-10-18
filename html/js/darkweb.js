SetupDarkweb = function(data) {
    $(".darkweb2-list").html("");
    $(".darkweb2-list").css({"left": "30vh"});
    $(".darkweb-header").css({"display": "none"});
    $(".darkweb-header").css({"left": "30vh"});
    AnimationDarkweb();
    setTimeout(function(){
        $(".darkweb-header").animate({left:0+"vh"}, 300).css({"display": "block"});
        if (data.length > 0) {
            $.each(data, function(i, darkweb){
                var element = '<div class="darkweb-list" id="darkwebid-'+i+'"> <div class="darkweb-list-firstletter">' + '<img src="img/darkweb/' + darkweb.item + '.png"' + 'width="70vh" height="70vh" style="border-radius:50%">' + '</div> <div class="darkweb-list-fullname">' + darkweb.label + '</div> <div class="darkweb-list-price">$' + darkweb.price + '</div> <input type="number" id = "' + 'darkweb' + i + '"class="darkweb-list-count" placeholder="0" required spellcheck="false"> <div class="darkweb-list-call"><i class="fas fa-shopping-cart"></i></div> </div>'
                darkweb.id = i;
                $(".darkweb2-list").animate({left:0+"vh"}, 300).append(element);
                $("#darkwebid-"+i).data('darkwebData', darkweb);
            });
        } else {
            var element = '<div class="darkweb-list"><div class="no-darkweb">Satılan hiç bir ürün yok.</div></div>'
            $(".darkweb2-list").append(element);
        }
    }, 2900)
}

AnimationDarkweb = function() {
    $(".darkweb-logo").css({"left": "0vh"});
    $("#darkweb-text").css({"opacity":"0.0", "left":"9vh"});
    $(".darkweb-app-loading").css({
        "display":"block",
        "left":"0vh",
    });
    setTimeout(function(){
        CurrentTab = "accounts";
        $(".darkweb-logo").animate({
            left: -12+"vh"
        }, 500);
        setTimeout(function(){
            $("#darkweb-text").animate({
                opacity: 1.0,
                left: 14+"vh"
            });
        }, 100);
        setTimeout(function(){
            $(".darkweb-app-loaded").css({"display":"block"}).animate({"padding-left":"0"}, 300);
            $(".darkweb-app-accounts").animate({left:0+"vh"}, 300);
            $(".darkweb-app-loading").animate({
                left: -30+"vh"
            },300, function(){
                $(".darkweb-app-loading").css({"display":"none"});
            });
        }, 1500)
    }, 500)
}

$(document).on('click', '.darkweb-list-call', function(e){
    e.preventDefault();

    var darkwebData = $(this).parent().data('darkwebData');
    var orderCount = Number($("#darkweb" + darkwebData.id).val());
    
    if (orderCount != "" && orderCount > 0) {
        $.post('http://almez-phonev2/DarkwebOrder', JSON.stringify({
            Item: darkwebData.item,
            Label: darkwebData.label,
            Price: darkwebData.price,
            Count: orderCount,
        }), function(status){
            if (status) {
                MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'Sipariş verildi.', "#27ae60");
            } else {
                MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'Yeterli paraya sahip değilsin.');
            }
        });
    } else {
        MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'Miktar girmediniz.');
    }
});
