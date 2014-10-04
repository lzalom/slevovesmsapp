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
    var email = 'miroslav.kralik@actumg2.cz';
    var password = 'k04L4PaS5';
    //var email = $('input#username').val();
    //var password = $('input#password').val();

    showLoader();
    /* prelogin */
    $.ajax({
        type: "POST",
        url: 'http://dev.slevovesms.cz/mobile_api/?req={action:%22prelogin%22,data:{email:%22'+email+'%22}}',
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
                url: 'http://dev.slevovesms.cz/mobile_api/;jsessionid='+data.sid+'?req={action:%22login%22,loginToken:%22'+loginTokenHash+'%22,data:{email:%22'+email+'%22}}',
                success: function(data){ 
                    console.log(data.action);
                    console.log(data.errorCode);
                    if (data.errorCode==0){

                        if (data.errorCode==101){
                            
                        }else{
                            /* download codes */
                            $.ajax({
                                type: "POST",
                                url: 'http://dev.slevovesms.cz/mobile_api/;jsessionid='+data.sid+'?req={action:%22downloadCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{}}',
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


/*


wget -O - "http://dev.slevovesms.cz/mobile_api/;jsessionid=IXwjA7S58NkYrtJFnw18yA?req={action:'login',loginToken:'f4e000dfb34d78cf22bc8849c8157f9db18e74facc387d5542f5df4a4ba02681',data:{email:'miroslav.kralik@actumg2.cz'}}"
{
  "action": "login",
  "sid": "IXwjA7S58NkYrtJFnw18yA",
  "errorCode": 0,
  "data": {}
}



Struktura requestu:

{
  "action": string, // výčet: prelogin, login, logout, ping, downloadCodes, redeemCodes
  "loginToken": logintoken, // kromě prelogin je required
  "data": { // dodatečná data k akcím, element musí být vždy přítomen, jinak MISSING_DATA
  }
}

Výpočet loginTokenu:
loginToken je sha256(email + "|" + md5(password) + "|" + loginToken_z_response)

př: pro výše uvedený email je na DEV1 md5 hesla dd95e869906c1546d8864ba8656ea4e2, takže loginToken se spočítá jako sha256("miroslav.kralik@actumg2.cz|dd95e869906c1546d8864ba8656ea4e2|YNUZ997FZG")
možno vyzkoušet na http://www.xorbin.com/tools/sha256-hash-calculator

login:
Request:
{action:'login',loginToken:'f42ef5cf1e5cd4cde713da3ddc817742243538b803e4ba91407386142ae70a03',data:{email:'miroslav.kralik@actumg2.cz'}}
Response:
{
  "action": "login",
  "errorCode": 0,
  "data": {}
}


*/

    
    
    
    
    /* post request, callback = json 
    callback = '{"request":"login", "return":"1", "client":"123"}';*/
        //{"request":"login", "return":"1", "data":[{}] }
        /* return 1: sucess, 0: error */
    //data = $.parseJSON(callback);
    //console.log($.parseJSON(callback));
    /*if (data['return']==1){
        $('.main').hide();
        $('.main#login').find('p.message').remove();
        $('.main#code').show();
    }
    if (data['return']==0){
        $('.main#login').find('button').before('<p class="message">Invalid username or password.</p>');
    }    */
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
            url: 'http://dev.slevovesms.cz/mobile_api/;jsessionid='+sid+'?req={action:%22getDiscountDetail%22,loginToken:%22'+loginTokenHash+'%22,data:{discountId:%22'+discountCode+'%22}}',
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
                $('#.discountDetail .img img').attr('src','http://dev.slevovesms.cz/ai/0/2/0/'+data.data.discountDetail.imgId);
                /* naplnění proměnné */
                discountCodeToRedeem = discountCoupon;
            },
            dataType: 'json'
        });    
    }else{
        showLoader();
        $('.main').hide();
        $('.main#code').show().find('button').remove('p.message').before('<p class="message">Invalid coupon or coupon already redeemed</p>');
        $('.main#code').show();
    }

    
    /*
http://dev.slevovesms.cz/mobile_api/?req={action:'getDiscountDetail',loginToken:'f7b3ed3d7770597ca4546299c6b747463771610009f74b6f2f81f23d54c24d73',data:{discountId:5831706594508800}}
    */
    
}

function redeem(){
    /* post request, callback = json */
    var discountCode = discountCoupon;
    $.ajax({
        type: "POST",
        url: 'http://dev.slevovesms.cz/mobile_api/;jsessionid='+sid+'?req={action:%22redeemCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{orders:[{discountCode:%22'+discountCode+'%22}]}}',
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
        },
        dataType: 'json'
    });
}

function homepage(){
    $('.main').hide();
    $('.main#code').show();
}