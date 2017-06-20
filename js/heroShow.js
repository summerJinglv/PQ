/**
 * Created by wj on 2017/4/18.
 */
function GetQueryString(name) {//页面跳转回来保存type值
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null){
        return r[2];
    }
}
var type=GetQueryString("type");
var selHeroes=JSON.parse(sessionStorage.getItem("selHeroes"+type));//获得相应的sessionStorage存的已选英雄对象
//console.log(selHeroes);

var showSelHeroesHtml='';

if(type==4){//熟练度选定英雄(特殊),只能选一个英雄
	$("input[name='type']").change(function(){
		var value=$(this).val();
		if(value==40){//熟练度
			 $("#type40").show();
	         $("#type45").hide();
	         var selHeroes4v40=JSON.parse(sessionStorage.getItem("selHeroes4v40"));
	         if(selHeroes4v40!=null){
	        	 var showSelHeroesHtml40='<div class="selected-hero" id="'+selHeroes4v40.id+'">'+selHeroes4v40.name+'</div>';
	        	 $("#dlHero40").html(showSelHeroesHtml40).show();
	        	 $("#selectHeroBtn40").hide();
	         }else{
	        	 showSelHeroesHtml40="";
	        	 $("#dlHero40").html(showSelHeroesHtml40).hide();
	        	 $("#selectHeroBtn40").show();
	         }
		}else if(value==45){//战力
			 $("#type45").show();
	         $("#type40").hide();
	         var selHeroes4v45=JSON.parse(sessionStorage.getItem("selHeroes4v45"));
	         if(selHeroes4v45!=null){
	        	 var showSelHeroesHtml45='<div class="selected-hero" id="'+selHeroes4v45.id+'">'+selHeroes4v45.name+'</div>';
	        	 $("#dlHero45").html(showSelHeroesHtml45).show();
	        	 $("#selectHeroBtn45").hide();
	         }else{
	        	 showSelHeroesHtml45="";
	        	 $("#dlHero45").html(showSelHeroesHtml45).hide();
	        	 $("#selectHeroBtn45").show();
	         }
	    }
	})
}else{
	for(var i in selHeroes){//遍历已选英雄
		showSelHeroesHtml+='<div class="aui-col-xs-4"><div class="has-hero" id="'+selHeroes[i].id+'">'+selHeroes[i].name+'</div></div>';
	}
}

$("#showSelHeroes").html(showSelHeroesHtml).on("click",".aui-col-xs-4",function(){//删除已选英雄，并更新sessionStorage
    $(this).remove();
    var leaveHero=$(".has-hero").not(this);
    if(type==1){
        var selHeroesArr1=[];
        leaveHero.each(function(){
            selHeroesArr1.push({"id":parseInt($(this).attr("id")),"name":$(this).text(),"type":type})
        });
        sessionStorage.setItem("selHeroes1",JSON.stringify(selHeroesArr1));
    }else if(type==2){
        var selHeroesArr2=[];
        leaveHero.each(function(){
            selHeroesArr2.push({"id":parseInt($(this).attr("id")),"name":$(this).text(),"type":type})
        });
        sessionStorage.setItem("selHeroes2",JSON.stringify(selHeroesArr2));
    }else if(type==3){
        var selHeroesArr3=[];
        leaveHero.each(function(){
            selHeroesArr3.push({"id":parseInt($(this).attr("id")),"name":$(this).text(),"type":type})
        });
        sessionStorage.setItem("selHeroes3",JSON.stringify(selHeroesArr3));
    }else if(type==5){
        var selHeroesArr5=[];
        leaveHero.each(function(){
            selHeroesArr5.push({"id":parseInt($(this).attr("id")),"name":$(this).text(),"type":type})
        });
        sessionStorage.setItem("selHeroes5",JSON.stringify(selHeroesArr5));
    }else if(type==6){
        var selHeroesArr6=[];
        leaveHero.each(function(){
            selHeroesArr6.push({"id":parseInt($(this).attr("id")),"name":$(this).text(),"type":type})
        });
        sessionStorage.setItem("selHeroes6",JSON.stringify(selHeroesArr6));
    }

});

$("#dlHero40").on("click",".selected-hero",function(){//熟练度删除指定英雄，并更新sessionStorage,选择英雄按钮出现
	 $("#selectHeroBtn40").show();
	 $(this).remove();
	 var selHeroes4v40=null;
     sessionStorage.setItem("selHeroes4v40",JSON.stringify(selHeroes4v40));
})
$("#dlHero45").on("click",".selected-hero",function(){//战力删除指定英雄，并更新sessionStorage,选择英雄按钮出现
	$("#selectHeroBtn45").show();
	$(this).remove();
	var selHeroes4v45=null;
	sessionStorage.setItem("selHeroes4v45",JSON.stringify(selHeroes4v45));
})

