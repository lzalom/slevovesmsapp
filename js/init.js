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
                        $('.main').hide();
                        $('.main#login').find('p.message').remove();
                        $('.main#code').show();
                        
                        /* download codes */
                        $.ajax({
                            type: "POST",
                            url: 'http://dev.slevovesms.cz/mobile_api/;jsessionid='+data.sid+'?req={action:%22downloadCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{}}',
                            success: function(data){ 
                                console.log(data.action);
                                console.log(data.errorCode);
                                console.log(data.data.orders[0]['discountCode']);
                                sid = data.sid;
                            },
                            dataType: 'json'
                        });
                        /* end */
                        
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
    /* post request, callback = json */
    var discountCode = $('input#discountCode').val();
    $.ajax({
        type: "POST",
        url: 'http://dev.slevovesms.cz/mobile_api/;jsessionid='+sid+'?req={action:%22redeemCodes%22,loginToken:%22'+loginTokenHash+'%22,data:{orders:[{discountCode:%22'+discountCode+'%22}]}}',
        success: function(data){ 
            console.log(data.action);
            console.log(data.errorCode);
            console.log(data.data.orders[0]['orderState']);
            $('p.message').remove(); 
            if (data.data.orders[0]['orderState']=='REDEEMED'){
                redeem();
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
    
   /*
   {action:'redeemCodes',loginToken:'f42ef5cf1e5cd4cde713da3ddc817742243538b803e4ba91407386142ae70a03',data:{orders:[{discountCode:'A81UG4BJUJ'},{discountCode:'blablabla'}]}}
   */
    
    /*
    $('.main#code').find('p.message').remove();
    
    callback = '{"request":"find", "return":"1", "redeemDate":"11.20.2013 - 14.44", "coupon":{"code":"XYZ123AB89", "created":"09.12.13", "expiring":"30.12.13", "img":"image_url", "discount":"-59%", "headline":"Smažený sýr s hranolkami a pivem v Cípu pro dva", "text":"Zajděte si do klasické staročeské hospůdky....", "price":"130", "oldPrice":"318"}}';
    data = $.parseJSON(callback);
    if (data['return']==1){
        $('.main').hide();
        $('.main#login, .main#code').find('p.message').remove();
                
        $('#dataCode').html(data['coupon']['code']);
        $('#dataCreated').text(data['coupon']['created']);
        $('#dataExpire').text(data['coupon']['expiring']);
        $('#dataDiscount').text(data['coupon']['discount']);
        $('#dataHeadline').text(data['coupon']['headline']);
        $('#dataText').text(data['coupon']['text']);
        $('#dataPrice').text(data['coupon']['price']);
        $('#oldPrice').text(data['coupon']['oldPrice']);
        $('p.img img').attr('src',data['coupon']['img']);   
        
        $('.main#coupon').show();     
        
    }
    if (data['return']==0){
        $('.main#code').find('button').before('<p class="message">Coupon not found</p>');
    } 
    if (data['return']==2){
        $('.main#code').find('button').before('<p class="message">Coupon expired.</p>');
    } 
    if (data['return']==3){
        $('.main#code').find('button').before('<p class="message">Coupon already redeemed on '+data['redeemDate']+'.</p>');
    } 
    */
}
function redeem(){
    /* post: coupon id */
    /* callback */
    $('.main').hide();
    $('.main#code').find('p.message').remove();
    $('.main#success').show();

}
function homepage(){
    $('.main').hide();
    $('.main#code').show();
}





/*
$.ajax({url: "employe.json"}).done(function(data){
    console.log($.parseJSON(data));
});
*/

/*
{"code":9000,"data":[{"id":145,"status":0,"userId":214,"parentId":0,"placeId":0,"timeId":0,"productId":356,"product":{"id":356,"shortName":"ZOO Lešná","longName":"long_name","description":"Listky do ZOO lešná","valid":true,"parentId":0,"price":0.0,"imgPath":"path","show":true,"persons":0}
*/