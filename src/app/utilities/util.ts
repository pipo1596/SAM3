import * as $ from 'jquery';

var logOut:any;//Global Variable
var modalIn:any;//Global Variable
var setMenu:boolean;
var head;
var uid="";

export class Util{

static setHead(inhead){
    head = inhead;
}
static getHead(inhead){
    if  (head !== undefined)return head;
    else return inhead;
}
static showWarnings(warn){

    warn.forEach(element => {
        
        $("#waningBody").append("<br><h4 style=\"margin-bottom:0\">"+element.code+"</h4>");
        $("#waningBody").append("<p>"+element.warn+"</p>");
        
    });

}
static showParag(words){

        
        $("#waningBody").html("<p>"+words+"</p>");
        this.modalid("show","modalqdsc");

}
static formatdateDsp(id,str){
    if ( $("#"+id)[0].type == 'date' ) 
        return str;
    else{
        if(str.length == 10)
        return str.substring(5,7)+'/'+str.substring(8,10) + '/'+str.substring(0,4);
        else 
        return "";
        
        }
    }

    static isFutureDate(idate){
        idate = idate.replace(/\//g,"-");
        var today = new Date();
        var twodays = new Date();
        var arrdate = idate.split("-");
        twodays.setDate(twodays.getDate() + 2);
        if(parseInt(arrdate[0])>100)
            var indate = new Date(arrdate[0],arrdate[1]-1,arrdate[2]);
        else
            var indate = new Date(arrdate[2],arrdate[0]-1,arrdate[1]);
        var char1 = today.getFullYear().toString()+today.getMonth().toString()+today.getDate().toString();
        var char2 = indate.getFullYear().toString()+indate.getMonth().toString()+indate.getDate().toString();
        var char3 = twodays.getFullYear().toString()+twodays.getMonth().toString()+twodays.getDate().toString();
        var num1 = parseInt(char1);
        var num2 = parseInt(char2);
        var num3 = parseInt(char3);
        //alert(indate+'/==/'+num1+'//'+num2+'//'+num3);
        //indate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
        return (num1 <= num2 && num2 <= num3)
        }

static getyear(id,str){
    if ( $("#"+id)[0].type == 'date' ) 
        return parseInt(str.substring(0,4));
    else
        return parseInt(str.substring(6));
}
static isdatestring(id,str){
    if ( $("#"+id)[0].type == 'date' ) 
        return true;
    else{
    var strar = str.split("/");
    if(strar.length !==3) return false;
    if(strar[0].length < 2 || parseInt(strar[0])>12 || parseInt(strar[0])<1 )return false;
    if(strar[1].length < 2 || parseInt(strar[1])>31 || parseInt(strar[1])<1 )return false;
    if(strar[2].length < 4  )return false;
    return true;
    }
}
static checkbyid(id){
    setTimeout(function(){ $("#"+id).prop("checked", true); }, 100);
}
static uncheckbyid(id){
    $("#"+id).prop("checked", false);
}

static Url(prgrm:string):string{ 
    if (location.hostname === "localhost")
        return "http://192.168.6.47:64005/"+prgrm; 
    else
        return '/'+prgrm;
}
static UrlStatic(prgrm:string):string{
    if (location.hostname === "localhost")
        return "http://192.168.6.47:64005/"+prgrm;
    else
        return location.origin+'/'+prgrm;
}

static hideDups(){
    var pvtitle="";
    $(".hidedups").each(function (index, value) { 
         if($(this).attr('title')==pvtitle){$(this).addClass("hidden");}; 
         pvtitle =$(this).attr('title'); 
      });
}

static prinQuote(){
    this.hideDups();
    var html ="";
    if(window.location.hostname == 'localhost')
    html ='<link rel="stylesheet" href="http://qa.milo.inds.com/styles.css">'+$("#printContract").html();
    else
     html ='<link rel="stylesheet" href="'+location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+'/styles.css">'+$("#printContract").html();
    var winPrint = window.open('', '', 'status=0,width=800,height=800,scrollbars=1');
    html = '<div class="container quoteprint"><div class="row white">'+html+'</div></div>';
winPrint.document.write(html);
winPrint.document.close();

winPrint.focus();
}
//==================================================================================//
static setIframeSrc(url){
    $('#pdfIframe').attr('src', url)
}
//===================================================================================//
static Env(){
    if (location.hostname === "localhost")
        return false;
    else
        return true;
}
//===================================================================================//
static hideWait(){ 
      $(".loading").fadeOut(300); 
}
//===================================================================================//
 static showWait(){  
     this.hideWait2(); 
     $(".loading").show();
 }
 //===================================================================================//    
 static setFAQ(){
    $("#staticpages .panel-body").addClass("hidden");
    $('input[name=faq]:checked').parentsUntil('.panel').parent().find(".panel-body").removeClass("hidden");
    setTimeout(function(){   $('html, body').animate({scrollTop: $('input[name=faq]:checked').parentsUntil('.panel').parent().offset().top-5 },200);},100);
 }
//===================================================================================//
 static responsiveMenu(){                                                                                               
    var menuType = 'desktop';                                                                                                 
    $(window).on('resize', function() {  
        var currMenuType = 'desktop';                                                                                         
        if ( $(window).width() < 991 ) {                                                   
            currMenuType = 'mobile';                                                                                          
        }  
        Util.setLeftNav(currMenuType);                                                                                                                    
        if ( currMenuType !== menuType ) {                                                                                    
            menuType = currMenuType;                                                                                          
            if ( currMenuType === 'mobile' ) {                                                                                
                var $mobileMenu = $('#mainnav').attr('id', 'mainnav-mobi').hide();                                            
                var hasChildMenu = $('#mainnav-mobi').find('li:has(ul)').addClass("submenu");                                                     
                $('#header').after($mobileMenu);                                                                              
                hasChildMenu.children('ul').hide();                                                                           
                hasChildMenu.children('a').after('<span class="btn-submenu"></span>');                                        
                $('.btn-menu').removeClass('active');                                                                         
            } else {                                                                                                          
                var $desktopMenu = $('#mainnav-mobi').attr('id', 'mainnav').removeAttr('style');                              
                $desktopMenu.find('.submenu').removeAttr('style');                                                            
                $('#header').find('.nav-wrap').append($desktopMenu);                                                          
                $('.btn-submenu').remove();                                                                                   
            }                                                                                                                 
        }                                                                                                                   
    });    
    if(!setMenu){ 
        setMenu = true;      
    setTimeout(function(){ 
        $(window).on('scroll', function() { if(window.scrollY > 200) 
                                                $("#totop").removeClass("hidden");
                                            else
                                                $("#totop").addClass("hidden");
    });     
            
    var currMenuType = 'desktop';                                                                                         
    if ( $(window).width() < 991) {                                                   
        currMenuType = 'mobile';                                                                                          
    }             
    Util.setLeftNav(currMenuType);                                                                                                        
    if ( currMenuType !== menuType ) {                                                                                    
        menuType = currMenuType;                                                                                          
        if ( currMenuType === 'mobile' ) {                                                                                
            var $mobileMenu = $('#mainnav').attr('id', 'mainnav-mobi').hide();                                            
            var hasChildMenu = $('#mainnav-mobi').find('li:has(ul)').addClass("submenu");                                                     
            $('#header').after($mobileMenu);                                                                              
            hasChildMenu.children('ul').hide();                                                                           
            hasChildMenu.children('a').after('<span class="btn-submenu"></span>');                                        
            $('.btn-menu').removeClass('active');                                                                         
        } else {                                                                                                          
            var $desktopMenu = $('#mainnav-mobi').attr('id', 'mainnav').removeAttr('style');                              
            $desktopMenu.find('.submenu').removeAttr('style');                                                            
            $('#header').find('.nav-wrap').append($desktopMenu);                                                          
            $('.btn-submenu').remove();                                                                                   
        }                                                                                                                 
    }                                                                                                             
    
        $('.btn-menu').on('click', function() {                                                                                   
            $('#mainnav-mobi').slideToggle(300);                                                                                  
            $(this).toggleClass('active');                                                                                        
        });

        $(document).on('click', '#mainnav-mobi li.submenu', function(e) {     
            $(this).children().toggleClass('active').next('ul').slideToggle(300);             
            e.stopImmediatePropagation()                                           
        });
        setMenu = false; 
    
},400);   }


}
static resetMenu(){
    $(window).off('resize');
    $(window).off('scroll');
    $('.btn-menu').off('click');
    $(document).off('click');
    this.responsiveMenu();
}
static makeid() {
    var text = "";

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
//===================================================================================//
static hideLeft(){
    var chgdiv = $("#step3left");
        chgdiv.removeClass('in');
        chgdiv.removeClass('show');
        chgdiv.attr('aria-hidden', 'true');
        $(".modal-backdrop").addClass("hidden");
        $(".modal-backdrop").addClass("fade");
        $(".modal-backdrop").removeClass("in");
}
//===================================================================================//
static showLeft(){
    var chgdiv = $("#step3left");
        chgdiv.addClass('in');
        chgdiv.addClass('show');
        chgdiv.attr('aria-hidden', 'false');
        $(".modal-backdrop").removeClass("hidden");
        $(".modal-backdrop").removeClass("fade");
        $(".modal-backdrop").addClass("in");
}
//===================================================================================//
static setLeftNav(mode){
    var chgdiv =$("#step3left");
    if(chgdiv.length){

        if(mode==='mobile'){
            chgdiv.removeClass("col-md-3");
            chgdiv.removeClass("hidden-sm");
            chgdiv.removeClass("hidden-xs");
            chgdiv.addClass('modal')
        }else{
            chgdiv.addClass("col-md-3");
            chgdiv.addClass("hidden-sm");
            chgdiv.addClass("hidden-xs");
            chgdiv.removeClass('modal')
        }
    }
    
}
//===================================================================================//
static hideUsers(){
    $("#adduser").slideUp();
    $("#addnewb").show();
}
//===================================================================================//
static hideTopForm(){
    $("#topform").slideUp();
    $("#addnewb").show();
}
//===================================================================================//
static hideRoles(){
    $("#addrole").slideUp();
    $("#addnewb").show();
}
//===================================================================================//
static showUsers(){
    $("#adduser").fadeIn();
    $("#addnewb").hide();  
}
//===================================================================================//
static showTopForm(){
    $("#topform").fadeIn();
    $("#addnewb").hide();  
}
//===================================================================================//
static showRoles(){
    $("#addrole").fadeIn();
    $("#addnewb").hide();  
}
//===================================================================================//
static formdata(formid){
   var formArray = $("#"+formid).serializeArray();
   var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
//===================================================================================//
static scrollStep2Err(){
    setTimeout(function(){ 
    if($(".errorspan2").not('.hidden').length<1) return false;
    $('html, body').animate({scrollTop: $(".errorspan2").not('.hidden').first().offset().top-22 },500);},100)
}
//===================================================================================//
static scrollToId(id){
    
    if($("#"+id).length<1) return false;
    $('html, body').scrollTop( $("#"+id).offset().top-5 );

}
//===================================================================================//
static scrollToId2(id){
    
    if($("#"+id).length<1) return false;
    $('html, body').animate({ scrollTop: $("#"+id).offset().top-5 }, 400);
}
//===================================================================================//
static scrollToIds(id){
    if($("#"+id).length<1) return false;
    $('html, body').animate({ scrollTop: $("#"+id).offset().top-5 }, 400,"swing",
    function(){ 
        $('html, body').stop();
        $("#"+id).fadeTo(100, 0.3, function() { $(this).fadeTo(500, 1.0); });

       } );
}
//===================================================================================//
static scrollTop(){
    $('html, body').animate({ scrollTop: 0}, 100,"swing",
    function(){ 
        $('html, body').stop();
       } );
}
//===================================================================================//
static getSelText(inval,inobj){
    var index = inobj.findIndex(obj => obj.rlno==inval);
   return inobj[index].desc;
}
//===================================================================================//
static getSelDesc(inval,inobj){
    var index = inobj.findIndex(obj => obj.key==inval);
   return inobj[index].desc;
}
//===================================================================================//
static noAuth(autharr,key){
 var index = autharr.findIndex(obj => obj.key==key);
    if(index >= 0)
        return false;
    else
        return true;
}
//===================================================================================//
static getSelDescP(inval,inobj){
    var index = inobj.findIndex(obj => obj.prg==inval.substring(0,10).trim());
    if(index >-1)
        return inobj[index].desc;
    else
        return "";
}
//===================================================================================//
static setfieldval(id,val){
    $("#"+id).val(val);
}
//===================================================================================//
static killDups(array){
var unique : [any] =[{}];
unique.pop();
$.each(array, function(i, el){
    if(unique.findIndex(el => el.desc == array[i].desc && 
                              el.prg  == array[i].prg  &&
                              el.cov  == array[i].cov) === -1) unique.push(el);
});
return unique;
}
//===================================================================================//
static killDups2(array){
var unique : [any] =[{}];
unique.pop();
$.each(array, function(i, el){
    if(unique.findIndex(el => el.desc == array[i].desc && 
                              el.prg  == array[i].prg ) === -1) unique.push(el);
});
return unique;
}
//===================================================================================//
static killDups3(array){
var unique : [any] =[{}];
unique.pop();
$.each(array, function(i, el){
    if(unique.findIndex(el => el.name == array[i].name ) === -1) unique.push(el);
});
return unique;
}
//===================================================================================//
static sortByKey(array, key,dir) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
       if (dir=="D")
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));  
       else
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
//===================================================================================//
static sortBy2Key(array, key1,key2,dir) {
    return array.sort(function(a, b) {
        var x = a[key1] + a[key2]; var y = b[key1] + b[key2];
       if (dir=="D")
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));  
       else
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
//===================================================================================//
static sortByKeyc(array, key,dir) {
    return array.sort(function(a, b) {
        var x = a[key].toString().toUpperCase(); var y = b[key].toString().toUpperCase();
       if (dir=="D")
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));  
       else
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
//===================================================================================//
static sortBy2Keyc(array, key1,key2,dir) {
    return array.sort(function(a, b) {
        var x = (a[key1] + a[key2]).toString().toUpperCase(); var y = (b[key1] + b[key2]).toString().toUpperCase();
       if (dir=="D")
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));  
       else
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
//===================================================================================//
static validZip(zip){
    var format = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    if(zip.match(format)){
        return true;

    }else{
        return false;
    }
}
//===================================================================================//
static validphone(phone){
    var format = /^\(\d{3}\) \s*\d{3}(?:-|\s*)\d{4}$/;
    if(phone.match(format)){
        return true;

    }else{
        return false;
    }
}
//===================================================================================//
static validemail(emal){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(emal.match(mailformat)){
        return true;

    }else{
        return false;
    }
}
//===================================================================================//
static showbyid(id){
    $("#"+id).removeClass("hidden");
}
//===================================================================================//
static hidebyid(id){
    $("#"+id).addClass("hidden");
}
//===================================================================================//
static focusById(id){
    $("#"+id).focus();
}
//===================================================================================//
static selectById(id){
    $("#"+id).focus();
    setTimeout(function(){ 
        $("#"+id)[0].setSelectionRange(0,9999);
    },200);
}
//===================================================================================//
static showWait2(message){
    message = message || '<p>Preparing quote please wait...</p>';
    this.hideWait();
    $("#calculating .bar").html(message);
    $("#calculating").removeClass("hidden");
    $("#calculating").show();
}
//===================================================================================//
static hideWait2(){
    $("#calculating").addClass("hidden");
    $("#calculating").hide();
}
//===================================================================================//
static modal(mode){
    if(mode=="show"){
        if($("#instatus").val()==="I"){
        $('#logout').addClass('in');
        $('#logout').addClass('show');
        $('#logout').css('display', 'block');
        $('#logout').attr('aria-hidden', 'false');
        $(".modal-backdrop").removeClass("hidden");
        $(".modal-backdrop").removeClass("fade");
        $(".modal-backdrop").addClass("in");
        }
    }else{
        $('#logout').removeClass('in');
        $('#logout').removeClass('show');
        $('#logout').css('display', 'none');
        $('#logout').attr('aria-hidden', 'true');
        $(".modal-backdrop").addClass("hidden");
        $(".modal-backdrop").addClass("fade");
        $(".modal-backdrop").removeClass("in");
    }
}
//===================================================================================//
static zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}
static firstErrFocus(){
    setTimeout(function(){ 
    $('.validating.required').first().focus();},200);

}
//===================================================================================//
static getparm(k){
    var p={};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){return p[k]=v})
    return k?p[k]:p;
   }
//===================================================================================//
static modalid(mode,id){
    if(mode=="show"){
        $('#'+id).addClass('in');
        $('#'+id).addClass('show');
        $('#'+id).css('display', 'block');
        $('#'+id).attr('aria-hidden', 'false');
        $(".modal-backdrop").removeClass("hidden");
        $(".modal-backdrop").removeClass("fade");
        $(".modal-backdrop").addClass("in");
    }else{
        $('#'+id).removeClass('in');
        $('#'+id).removeClass('show');
        $('#'+id).css('display', 'none');
        $('#'+id).attr('aria-hidden', 'true');
        $(".modal-backdrop").addClass("hidden");
        $(".modal-backdrop").addClass("fade");
        $(".modal-backdrop").removeClass("in");
    }
    }
//===================================================================================//
static modalidmain(mode,id){
    if(mode=="show"){
        $('#'+id).addClass('in');
        $('#'+id).addClass('show');
        $('#'+id).css('display', 'block');
        $('#'+id).attr('aria-hidden', 'false');
        $(".modal-backdrop").removeClass("hidden");
        $(".modal-backdrop").removeClass("fade");
        $(".modal-backdrop").addClass("in");
    }else{
        $('#'+id).removeClass('in');
        $('#'+id).removeClass('show');
        $('#'+id).css('display', 'none');
        $('#'+id).attr('aria-hidden', 'true');
        //$(".modal-backdrop").addClass("hidden");
        //$(".modal-backdrop").addClass("fade");
        //$(".modal-backdrop").removeClass("in");
    }
    }
//===================================================================================//
static alertmodal(message,title){
    $("#alertBody").html(message);
    $("#alertTitle").html(title);
    this.modalid('show','alertModal');
    }
//==================================================================================//
static  cardType(ccnum) {
    var sel_brand;
   
    // American Express
    var amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
    // Visa
    var visa_regex = new RegExp('^4[0-9]{0,}$'); //4
    // MasterCard
    var mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
    var maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
    //Discover
    var discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
    ////6011, 622126-622925, 644-649, 65
   
   
    // get rid of anything but numbers
    ccnum = ccnum.replace(/\D/g, '');
   
    // checks per each, as their could be multiple hits
    //fix: ordering matter in detection, otherwise can give false results in rare cases
    if (ccnum.match(amex_regex) && ccnum.length ==15) {
      sel_brand = "A";
    }  else if (ccnum.match(visa_regex) && ccnum.length ==16 ) {
      sel_brand = "V";
    } else if (ccnum.match(mastercard_regex) && ccnum.length ==16) {
      sel_brand = "M";
    } else if (ccnum.match(discover_regex) && ccnum.length ==16) {
      sel_brand = "D";
    } else if (ccnum.match(maestro_regex) && ccnum.length ==16) {
      if (ccnum[0] == '5') { //started 5 must be mastercard
        sel_brand = "M";
      } else {
        sel_brand = "M"; //maestro is all 60-69 which is not something else, thats why this condition in the end
      }
    } else {
      sel_brand = "U";
    }
   
    return sel_brand;
  }

static newQuote(){
    if (window.location.href.indexOf("QuoteNew") != -1)
        return true;
    else
        return false;
}
//===================================================================================//
static Usersnap(){
    if($("#usersnap").length>0)return false;
   var s = document.createElement("script"); 
   s.type = "text/javascript"; 
   s.async = true; 
   s.id = "usersnap";
   s.src = '//api.usersnap.com/load/69b4adfd-ead6-4236-9866-c0b963f1a978.js';
   var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
}
//===================================================================================//
static Fullstory(email,name){
    if($("#fsemail").length<1)return false;
    $("#fsemail").val(email);
    $("#fsname").val(name);
    $("#fullstory").remove();
   var s = document.createElement("script"); 
   s.type = "text/javascript"; 
   s.async = true; 
   s.id = "fullstory";
   s.src = '/assets/fullstory.js?pm=1';
   var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
}
//===================================================================================//
}