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
    
    


});

$(window).ready(function(){


    
});
function showLoader(){
    $('.main').hide();
    $('.main#loaderScreen').show();
}
function login(){
    /* post request, callback = json */
    callback = '{"request":"login", "return":"1", "client":"123"}';
        //{"request":"login", "return":"1", "data":[{}] }
        /* return 1: sucess, 0: error */
    data = $.parseJSON(callback);
    //console.log($.parseJSON(callback));
    if (data['return']==1){
        $('.main').hide();
        $('.main#login').find('p.message').remove();
        $('.main#code').show();
    }
    if (data['return']==0){
        $('.main#login').find('button').before('<p class="message">Invalid username or password.</p>');
    }    
}
function find(){
    /* post request, callback = json */
    $('.main#code').find('p.message').remove();
    callback = '{"request":"find", "return":"1", "redeemDate":"11.20.2013 - 14.44", "coupon":{"code":"XYZ123AB89", "created":"09.12.13", "expiring":"30.12.13", "img":"image_url", "discount":"-59%", "headline":"Smažený sýr s hranolkami a pivem v Cípu pro dva", "text":"Zajděte si do klasické staročeské hospůdky....", "price":"130", "oldPrice":"318"}}';
    /* return 1: success-load data, 0: not found, 2: expired, 3: already redeemed */
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