$(document).ready(function(){

    $('form').submit(function(){ return false; });
    
    $('button[name=login]').click(function(){
        showLoader();
        login();
        return false;
    });
    $('button[name=find]').click(function(){
        showLoader();
        find();
        return false;
    });
    $('button[name=redeem]').click(function(){
        showLoader();
        redeem();
        return false;
    });
    $('button[name=backToFind]').click(function(){
        showLoader();
        $('.main').hide();
        $('.main#login').find('p.message').remove();
        $('.main#code').show();
        return false;
    });
    $('button[name=homepage]').click(function(){
        showLoader();
        homepage();
        return false;
    });
    $('section.settings a').click(function(){
        showLoader();
        settings();
        return false;
    });
    
    /* input limits, init */
    $('input#discountCode').val('');
    $('input#discountCode').keyup(function(){
        if ( $(this).val()=='' ){
            $('button[name=find]').attr('disabled','disabled').addClass('disabled');;
        }else{
            $('button[name=find]').removeAttr('disabled').removeClass('disabled');   
        }
    });


});

$(window).ready(function(){


    
});
function showLoader(){
    $('.main').hide();
    $('.main#loaderScreen').show();
}
function settings(){
    $('.main').hide();
    $('.main#settings').show();
}
function login(){
    //var email = 'miroslav.kralik@actumg2.cz';
    //var password = 'k04L4PaS5';
    var email = $('input#username').val();
    var password = $('input#password').val();

    showLoader();
    /* prelogin */
    $.ajax({
        type: "POST",
        url: 'http://dev.gurmanie.com/mobile_api/?req={action:%22prelogin%22,data:{email:%22'+email+'%22}}',
        success: function(data){ 
            console.log(data.action);
            console.log(data.errorCode);
            console.log(data.loginToken);
            //console.log(email + "|" + CryptoJS.MD5(password) + "|" + data.loginToken);
            console.log(email + "|" + "dd95e869906c1546d8864ba8656ea4e2" + "|" + data.loginToken);
            //var loginTokenHash = CryptoJS.SHA256(email + "|" + CryptoJS.MD5(password) + "|" + data.loginToken);
            loginTokenHash = CryptoJS.SHA256(email + "|" + "dd95e869906c1546d8864ba8656ea4e2" + "|" + data.loginToken);
            console.log('token: '+loginTokenHash);
        
            /* login */
            $.ajax({
                type: "POST",
                url: 'http://dev.gurmanie.com/mobile_api/;jsessionid='+data.sid+'?req={action:%22login%22,loginToken:%22'+loginTokenHash+'%22,data:{email:%22'+email+'%22}}',
                success: function(data){ 
                    console.log(data.action);
                    console.log(data.errorCode);
                    if (data.errorCode==0){

                        if (data.errorCode==101){
                            
                        }else{
                            /* download available codes */
                            $.ajax({
                                type: "POST",
                                url: 'http://dev.gurmanie.com/mobile_api/;jsessionid='+data.sid+'?req={action:%22downloadCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{}}',
                                success: function(data){ 
                                    console.log(data.action);
                                    console.log(data.errorCode);
                                    console.log(data.data);
                                    console.log('length: '+data.data.orders.length);
                                    if (data.data.orders.length>0){
                                        console.log(data.data.orders.length+' codes available');
                                        ordersArray = data.data.orders;
                                        $('.main').hide();
                                        $('.main#login').find('p.message').remove();
                                        $('.main#code').find('input,button').show();
                                        $('.main#code').show();
                                        sid = data.sid;
                                    }else{
                                        console.log('no codes available');
                                        $('.main').hide();
                                        $('.main#login').find('p.message').remove();
                                        $('.main#code').show();
                                        $('.main#code').find('input,button').hide();
                                        $('.main#code').find('button').before('<p class="message">No coupon available.</p>');
                                    }
                                    $('.main').hide();
                                    $('.main#login').find('p.message').remove();
                                    $('.main#code').show();
                                    sid = data.sid;
                                    
                                    /* update of list */
                                    /* 5 minutes: default */
                                    function downloadCodes(){
                                        /* download available codes */
                                        console.log('timer: codes downloading');
                                        $.ajax({
                                            type: "POST",
                                            url: 'http://dev.gurmanie.com/mobile_api/;jsessionid='+data.sid+'?req={action:%22downloadCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{}}',
                                            success: function(data){ 
                                                console.log(data.action);
                                                console.log(data.errorCode);
                                                console.log(data.data);
                                                console.log('length: '+data.data.orders.length);
                                                if (data.data.orders.length>0){
                                                    console.log(data.data.orders.length+' codes available');
                                                    ordersArray = data.data.orders;
                                                    $('.main').hide();
                                                    $('.main#login').find('p.message').remove();
                                                    $('.main#code').find('input,button').show();
                                                    $('.main#code').show();
                                                    sid = data.sid;
                                                }else{
                                                    console.log('no codes available');
                                                    $('.main').hide();
                                                    $('.main#login').find('p.message').remove();
                                                    $('.main#code').show();
                                                    $('.main#code').find('input,button').hide();
                                                    $('.main#code').find('button').before('<p class="message">No coupon available.</p>');
                                                }
                                            },
                                            dataType: 'json'
                                        });
                                        /* end */   
                                    }
                                    setInterval(function() {downloadCodes(); }, 300000);
                                },
                                dataType: 'json'
                            });
                            /* end */                        
                        }

                    }else{
                        $('.main').hide();
                        $('.main#login').show();
                        $('.main#login').find('button').before('<p class="message">Invalid username or password.</p>');
                    }
                },
                dataType: 'json'
            });
        },
        dataType: 'json'
    });
}
function find(){
    var control = 0;
    for (index = 0; index < ordersArray.length; index++) {
        console.log(ordersArray[index]['discountCode']);
        if (ordersArray[index]['discountCode']==$('input#discountCode').val()){
            discountCode = ordersArray[index]['discountId'];
            discountCoupon = $('input#discountCode').val();
            control = 1;
        }
    }
    if (control==1){
        $.ajax({
            type: "POST",
            url: 'http://dev.gurmanie.com/mobile_api/;jsessionid='+sid+'?req={action:%22getDiscountDetail%22,loginToken:%22'+loginTokenHash+'%22,data:{discountId:%22'+discountCode+'%22}}',
            success: function(data){ 
                console.log(discountCode);
                console.log(data.action);
                console.log(data.errorCode);
                $('p.message').remove(); 
                $('.main').hide();
                $('.main#coupon').show();
                $('#dataCode').html(discountCoupon);
                $('#dataCreated').html(discountCode).hide();
                $('#dataExpire').html(data.data.discountDetail.expired);
                if (data.data.discountDetail.discountType=='PERCENT'){
                    $('#dataDiscount').html(data.data.discountDetail.discount+' %');
                }
                if (data.data.discountDetail.discountType=='PLUSFREE'){
                    $('#dataDiscount').html(data.data.discountDetail.amount+'+'+data.data.discountDetail.amountFree);
                }
                if (data.data.discountDetail.discountType=='FREE'){
                    $('#dataDiscount').html('SPECIÁLNÍ');
                }
                $('#dataHeadline').html(data.data.discountDetail.name);
                $('#dataText').html(data.data.discountDetail.annotation);
                
                if (data.data.discountDetail.discountType=='PERCENT'){
                    $('#dataPrice').html(data.data.discountDetail.price+' Kč').show();
                    $('#oldPrice').html(data.data.discountDetail.regularPrice+' Kč').show();
                    $('.discountDetail .price').show(); 
                }
                if (data.data.discountDetail.discountType=='PLUSFREE'){
                    $('.discountDetail .price').hide(); 
                }
                if (data.data.discountDetail.discountType=='FREE'){
                    $('#dataPrice').hide();
                    $('#oldPrice').html(data.data.discountDetail.regularPrice+' Kč');
                    $('.discountDetail .price').show(); 
                }
                $('#.discountDetail .img img').attr('src','http://dev.gurmanie.com/ai/0/2/0/'+data.data.discountDetail.imgId);
                /* naplnění proměnné */
                discountCodeToRedeem = discountCoupon;
            },
            dataType: 'json'
        });    
    }else{
        showLoader();
        $('.main').hide();
        $('p.message').remove();
        $('.main#code').show().find('button').before('<p class="message">Invalid coupon or coupon already redeemed</p>');
        $('.main#code').show();
    }    
}

function redeem(){
    /* post request, callback = json */
    var discountCode = discountCoupon;
    $.ajax({
        type: "POST",
        url: 'http://dev.gurmanie.com/mobile_api/;jsessionid='+sid+'?req={action:%22redeemCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{orders:[{discountCode:%22'+discountCode+'%22}]}}',
        success: function(data){ 
            console.log(data.action);
            console.log(data.errorCode);
            console.log(data.data.orders[0]['orderState']);
            $('p.message').remove(); 
            if (data.data.orders[0]['orderState']=='REDEEMED'){
                $('.main#code').show().find('button').before('<p class="message">Congratulations! Your coupon has been redeemed :-)</p>');
            }
            if (data.data.orders[0]['orderState']=='ALREADY_REDEEMED'){
                $('.main#code').show().find('button').before('<p class="message">Coupon already redeemed</p>');
            }
            if (data.data.orders[0]['orderState']=='EXPIRED'){
                $('.main#code').show().find('button').before('<p class="message">Coupon expired</p>');
            }
            /* download available codes */
            $.ajax({
                type: "POST",
                url: 'http://dev.gurmanie.com/mobile_api/;jsessionid='+data.sid+'?req={action:%22downloadCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{}}',
                success: function(data){ 
                    console.log(data.action);
                    console.log(data.errorCode);
                    console.log(data.data);
                    console.log('length: '+data.data.orders.length);
                    if (data.data.orders.length>0){
                        ordersArray = data.data.orders;
                    }else{
                        console.log('no codes');
                    }
                    $('.main').hide();
                    $('.main#login').find('p.message').remove();
                    $('.main#code').show();
                    sid = data.sid;
                },
                dataType: 'json'
            });
            /* end */  
        },
        dataType: 'json'
    });
}

function homepage(){
    $('.main').hide();
    $('.main#code').show();
}