/**
 * Created by CH on 2017/4/17.
 */
/* 点击按钮判断有无登录的函数 */
function notLogin(data,type){
    var getUserInfo = JSON.parse(localStorage.getItem("setUserInfo"));
    if(getUserInfo == null){
        //iframe层-登录页
    	if(data==1||data==2||data==3||data==4||data==5||data==6){
    		addCookie(data);
    	}
    	loginLayerBox();
    }else if(data == "myWallet"){
        window.location.href="/view/html/wallet.html";
    }else if(data == "myOrder"){
        window.location.href="/view/html/myOrder.html";
    }else if(data == "safetySet"){
        window.location.href = '/view/html/safetySet.html';
    }else if(data == "chatBtn"){
        $.ajax({
            url: "/getIndexMessage_NL",
            type: "post",
            dataType: "json",
            success: function(data) {
                console.log(data);
                if(data.num > 0){
                	if (data.messageFrom == '30') {
                		window.location.href = '/view/html/ptqChat.html?rowId='+data.lastOrderId+'';
                	} else {
                		window.location.href = '/view/html/chat.html?rowId='+data.lastOrderId+'';
                	}
                }else{
                    window.location.href = '/view/html/chat.html';
                }
            }
        });
    }else if(data == '1'){
        consultPrice(1);
    }else if(data == '2'){
        consultPrice(2);
    }else if(data == '3'){
        consultPrice(3);
    }else if(data == '4'){
        consultPrice(4);
    }else if(data == '5'){
        consultPrice(5);
    }else if(data == '6'){
        consultPrice(6);
    }
}
/* 页面跳转回来保存type值 */
$("#type").val(GetQueryString("type"));
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null){
        return r[2];
    }
}


/* 分辨页面并展示区服段位信息等 */
var infoType = GetQueryString("type");
if(infoType == 1 || infoType == 2 || infoType == 3 || infoType == 4 || infoType == 5 || infoType == 6){
    /* 获取段位信息 */
    getGameDan();
    
    /* 获取本地缓存的所有区 */
    var area = JSON.parse(sessionStorage.getItem("area"));
    if(area != null){
	   for(var i in area){//页面展示所有区
           var creatArea = $('<option value="'+area[i].regionId+'">'+area[i].regionName+'</option>')
           $(".type-select-area").append(creatArea);
       }
       $(".type-select-area").change(function(){//区重新选择后，页面展示对应的服
    	   var areaVal = $(this).val();
    	   getGameServer(areaVal);
       })
    }else{
    	getGameArea();
    }
    /* 获取本地缓存的已选区下的所以服，并展示在页面 */
    var serverCookie = JSON.parse(sessionStorage.getItem("serverCookie"+infoType+""));
    console.log("区分页面保存的serverCookie: === ");
    console.log(serverCookie);
    if(serverCookie != null){
    	 for(var i in serverCookie){
             var creatServer = $('<option value="'+serverCookie[i].serverId+'">'+serverCookie[i].serverName+'</option>')
             $(".type-select-serve").append(creatServer);
         }
    }else{
    	 getGameServer("2142");
    }
}

function getGameArea() {//获取区，直接保存到本地
    $.ajax({
        url: "/getGameArea_NL",
        type: "post",
        data:{gameId:314},
        dataType: "json",
        success: function(data) {
            var area = data.data;
            sessionStorage.setItem("area",area);
        }
    });
}
function getGameServer(serverId) {//获取服并展示到页面，再将当前选中区对应的服保存到本地
    $.ajax({
        url: "/getGameServer_NL",
        type: "post",
        data:{gameId:314,areaId:serverId},
        dataType: "json",
        success: function(data) {
            var server =JSON.parse( data.data);
            console.log(server);
            $(".type-select-serve").empty();
            for(var i in server){
                var creatServer = $('<option value="'+server[i].serverId+'">'+server[i].serverName+'</option>')
                $(".type-select-serve").append(creatServer);
            }
            var serverCookie = data.data;
            sessionStorage.setItem("serverCookie"+GetQueryString("type")+"",serverCookie);
        }
    });
}
function getGameDan() {// 获取段位信息并展示在页面
    $.ajax({
        url: "/getWzryDivision_NL",
        type: "post",
        dataType: "json",
        success: function(data) {
            var db = data.data;
            for(var i in db){
                var creatGameDan = $('<option value="'+db[i].value+'">'+db[i].label+'</option>');
                $(".type-select-dan").append(creatGameDan);
            }
            $(".type-select-dan").eq(1).val("21");
        }
    });
}


/* 分类值只能为数字 */
$("#mwLv").bind('input change',function(){
	listenmwLv("#mwLv")
});
$("#mwLv40").bind('input change',function(){
	listenmwLv("#mwLv40")
});
$("#mwLv45").bind('input change',function(){
	listenmwLv("#mwLv45")
});

function listenmwLv(obj){
	if($(obj).val() != ""){
		if(!(/^[1-9]\d*|0$/.test($(obj).val()))){
			layer.msg("铭文格式不正确");
			$(obj).val("");
			return false;
		}
		if($(obj).val() > 150){
			layer.msg("铭文不能大于150");
			$(obj).val("");
			return false;
		}
	}
}


/* 退出登录 */
function outLogin() {
    $.ajax({
        url: "/outLogin",
        type: "post",
        dataType: "json",
        success: function(data) {
            if(data.code == 1){
                layer.msg(data.msg);
                localStorage.setItem("setUserInfo",null);
                setTimeout(function(){
           			window.location.reload(); 
           		},2000)
            }
            console.log(data);

        }
    });
}
/* 点击咨询报价按钮上传需求 */
function consultPrice(type) {
    /* 上传的数据 */
    var selHeroes;
    /* 非空判断 */
    if(type == 1){
        if($("#nowStar").val() == "" || $("#nowStar").val() == null){
            layer.msg("请填写当前星级");
            return false;
        }else if(!(/^[1-9]\d*|0$/.test($("#nowStar").val()))){
            layer.msg("当前星级格式不正确");
            $("#nowStar").val("");
            return false;
        }
        if($("#targetStar").val() == "" || $("#targetStar").val() == null){
            layer.msg("请填写目标星级");
            return false;
        }else if(!(/^[1-9]\d*|0$/.test($("#targetStar").val()))){
            layer.msg("目标星级格式不正确");
            $("#targetStar").val("");
            return false;
        }
        if($("#mwLv").val() != ""){
        	if(!(/^[1-9]\d*|0$/.test($("#mwLv").val()))){
        		layer.msg("铭文格式不正确");
        		$("#mwLv").val("");
        		return false;
        	}
        	if($("#mwLv").val() > 150){
        		layer.msg("铭文不能大于150");
        		$("#mwLv").val("");
        		return false;
        	}
        }
    }
    if(type == 2){
        if($("#cjName").val() == "" || $("#cjName").val() == null){
            layer.msg("请填写成就名称");
            return false;
        }
        if($("#mwLv").val() != ""){
        	if(!(/^[1-9]\d*|0$/.test($("#mwLv").val()))){
        		layer.msg("铭文格式不正确");
        		$("#mwLv").val("");
        		return false;
        	}
        	if($("#mwLv").val() > 150){
        		layer.msg("铭文不能大于150");
        		$("#mwLv").val("");
        		return false;
        	}
        }
    }
    if(type == 3){
        if($("#dlCon").val() == "" || $("#dlCon").val() == null){
            layer.msg("请填写服务内容");
            return false;
        }
        if($("#mwLv").val() != ""){
        	if(!(/^[1-9]\d*|0$/.test($("#mwLv").val()))){
        		layer.msg("铭文格式不正确");
        		$("#mwLv").val("");
        		return false;
        	}
        	if($("#mwLv").val() > 150){
        		layer.msg("铭文不能大于150");
        		$("#mwLv").val("");
        		return false;
        	}
        }
    }
    if(type == 4){
        if($("input[name='type']:checked").val()==40){//熟练度
        	if($("#dlHero40>.selected-hero").length<1){
                 layer.msg("请选择指定英雄");
                 return false;
            }
        	if($("#dlNowProficiency").val() == "" || $("#dlNowProficiency").val() == null){
        		layer.msg("请填写当前熟练度");
        		return false;
        	}
    		if(!(/^(0|\+?[1-9][0-9]*)$/.test($("#dlNowProficiency").val()))){
    			layer.msg("当前熟练度格式不正确");
    			$("#dlNowProficiency").val("");
    			return false;
    		}
        	if($("#dlTargetProficiency").val() == "" || $("#dlTargetProficiency").val() == null){
        		layer.msg("请填写目标熟练度");
        		return false;
        	}
        	if(!(/^(0|\+?[1-9][0-9]*)$/.test($("#dlTargetProficiency").val()))){
    			layer.msg("目标熟练度格式不正确");
    			$("#dlTargetProficiency").val("");
    			return false;
    		}
	    	if($("#mwLv40").val() != ""){
	         	if(!(/^[1-9]\d*|0$/.test($("#mwLv40").val()))){
	         		layer.msg("铭文格式不正确");
	         		$("#mwLv40").val("");
	         		return false;
	         	}
	         	if($("#mwLv40").val() > 150){
	         		layer.msg("铭文不能大于150");
	         		$("#mwLv40").val("");
	         		return false;
	         	}
	        }
        }else if($("input[name='type']:checked").val()==45){//战力
        	if($("#dlHero45>.selected-hero").length<1){
                 layer.msg("请选择指定英雄");
                 return false;
            }
        	if($("#dlNowPower").val() == "" || $("#dlNowPower").val() == null){
        		layer.msg("请填写当前战力");
        		return false;
        	}
        	if(!(/^(0|\+?[1-9][0-9]*)$/.test($("#dlNowPower").val()))){
    			layer.msg("当前战力格式不正确");
    			$("#dlNowPower").val("");
    			return false;
    		}
        	if($("#dlTargetPower").val() == "" || $("#dlTargetPower").val() == null){
        		layer.msg("请填写目标战力");
        		return false;
        	}
        	if(!(/^(0|\+?[1-9][0-9]*)$/.test($("#dlTargetPower").val()))){
    			layer.msg("目标战力格式不正确");
    			$("#dlTargetPower").val("");
    			return false;
    		}
        	if($("#mwLv45").val() != ""){
	         	if(!(/^[1-9]\d*|0$/.test($("#mwLv45").val()))){
	         		layer.msg("铭文格式不正确");
	         		$("#mwLv45").val("");
	         		return false;
	         	}
	         	if($("#mwLv45").val() > 150){
	         		layer.msg("铭文不能大于150");
	         		$("#mwLv45").val("");
	         		return false;
	         	}
	        }
        }
    }
    if(type == 5){
        if($("#nowGold").val() == "" || $("#nowGold").val() == null){
            layer.msg("请填写当前金币");
            return false;
        }
        if($("#targetGold").val() == "" || $("#targetGold").val() == null){
            layer.msg("请填写目标金币");
            return false;
        }
        if($("#mwLv").val() != ""){
        	if(!(/^[1-9]\d*|0$/.test($("#mwLv").val()))){
        		layer.msg("铭文格式不正确");
        		$("#mwLv").val("");
        		return false;
        	}
        	if($("#mwLv").val() > 150){
        		layer.msg("铭文不能大于150");
        		$("#mwLv").val("");
        		return false;
        	}
        }
    }
    if(type == 6){
        if($("#fwCon").val() == "" || $("#fwCon").val() == null){
            layer.msg("请填写服务内容");
            return false;
        }
        if($("#mwLv").val() != ""){
        	if(!(/^[1-9]\d*|0$/.test($("#mwLv").val()))){
        		layer.msg("铭文格式不正确");
        		$("#mwLv").val("");
        		return false;
        	}
        	if($("#mwLv").val() > 150){
        		layer.msg("铭文不能大于150");
        		$("#mwLv").val("");
        		return false;
        	}
        }
    }
        /* 分类和英雄分开取值 */
    var hero = "";
    var inscriptionsLevel = "";
    /* 如果分类选项没填写就传页面的一个值 */
    if(type==4){
    	var value=$("input[name='type']:checked").val();
    	if(value==40){//熟练度
    		var classifyVal4v40 = JSON.parse(sessionStorage.getItem("classifyVal4v40"));
    		if(classifyVal4v40!=null){
    			if(classifyVal4v40.tank==""&&classifyVal4v40.soldier==""&&classifyVal4v40.assassin==""&&classifyVal4v40.master==""&&classifyVal4v40.shooter==""&&classifyVal4v40.assist==""){
    				inscriptionsLevel=$("#mwLv40").val();
    			}else{
    				var tank = classifyVal4v40.tank == "" ? "" : "坦克"+classifyVal4v40.tank+"，";
    				var soldier = classifyVal4v40.soldier == "" ? "" : "战士"+classifyVal4v40.soldier+"，";
    				var assassin = classifyVal4v40.assassin == "" ? "" : "刺客"+classifyVal4v40.assassin+"，";
    				var master = classifyVal4v40.master == "" ? "" : "法师"+classifyVal4v40.master+"，";
    				var shooter = classifyVal4v40.shooter == "" ? "" : "射手"+classifyVal4v40.shooter+"，";
    				var assist = classifyVal4v40.assist == "" ? "" : "辅助"+classifyVal4v40.assist+"，";
    				inscriptionsLevel = tank + soldier + assassin + master + shooter + assist;
    				inscriptionsLevel = inscriptionsLevel.substring(0,inscriptionsLevel.length-1);
    			}
    		}else{
    			inscriptionsLevel=$("#mwLv40").val();
    		}
    	}else if(value==45){//战力
    		var classifyVal4v45 = JSON.parse(sessionStorage.getItem("classifyVal4v45"));
    		if(classifyVal4v45!=null){
	    		if(classifyVal4v45.tank==""&&classifyVal4v45.soldier==""&&classifyVal4v45.assassin==""&&classifyVal4v45.master==""&&classifyVal4v45.shooter==""&&classifyVal4v45.assist==""){
	    			inscriptionsLevel=$("#mwLv45").val();
	    		}else{
	        		var tank = classifyVal4v45.tank == "" ? "" : "坦克"+classifyVal4v45.tank+"，";
	        		var soldier = classifyVal4v45.soldier == "" ? "" : "战士"+classifyVal4v45.soldier+"，";
	        		var assassin = classifyVal4v45.assassin == "" ? "" : "刺客"+classifyVal4v45.assassin+"，";
	        		var master = classifyVal4v45.master == "" ? "" : "法师"+classifyVal4v45.master+"，";
	        		var shooter = classifyVal4v45.shooter == "" ? "" : "射手"+classifyVal4v45.shooter+"，";
	        		var assist = classifyVal4v45.assist == "" ? "" : "辅助"+classifyVal4v45.assist+"，";
	        		inscriptionsLevel = tank + soldier + assassin + master + shooter + assist;
	                inscriptionsLevel = inscriptionsLevel.substring(0,inscriptionsLevel.length-1);
	    		}
    		}else{
    			inscriptionsLevel=$("#mwLv45").val();
    		}
    	}
    }else{
    	if($("#tank").val() == "" && $("#soldier").val() == "" && $("#assassin").val() == "" && $("#master").val() == "" && $("#shooter").val() == "" && $("#assist").val() == "" ){
            inscriptionsLevel = $("#mwLv").val();
        }else{
        	var tank = $("#tank").val() == "" ? "" : "坦克"+$("#tank").val()+"，";
        	var soldier = $("#soldier").val() == "" ? "" : "战士"+$("#soldier").val()+"，";
        	var assassin = $("#assassin").val() == "" ? "" : "刺客"+$("#assassin").val()+"，";
        	var master = $("#master").val() == "" ? "" : "法师"+$("#master").val()+"，";
        	var shooter = $("#shooter").val() == "" ? "" : "射手"+$("#shooter").val()+"，";
        	var assist = $("#assist").val() == "" ? "" : "辅助"+$("#assist").val()+"，";
            inscriptionsLevel = tank + soldier + assassin + master + shooter + assist;
            inscriptionsLevel = inscriptionsLevel.substring(0,inscriptionsLevel.length-1);
        }
    }
    
    var gameType,startSld,endSld;
    if($("#type").val()==4){//熟练度页面传值特殊处理
    	if($("input[name='type']:checked").val()==40){
    		gameType=40;
    		startSld=$("#dlNowProficiency").val();
    		endSld=$("#dlTargetProficiency").val();
    		var selHeroes4v40 = JSON.parse(sessionStorage.getItem("selHeroes4v40"));
    		hero=selHeroes4v40.name+"，";
    	}else if($("input[name='type']:checked").val()==45){
    		gameType=45;
    		startSld=$("#dlNowPower").val();
    		endSld=$("#dlTargetPower").val();
    		var selHeroes4v45 = JSON.parse(sessionStorage.getItem("selHeroes4v45"));
    		hero=selHeroes4v45.name+"，";
    	}
    }else{
    	gameType=$("#type").val()+"0";
    	
    	selHeroes = JSON.parse(sessionStorage.getItem("selHeroes"+type));
        if(selHeroes == null||selHeroes.length==0){
            layer.msg("请选择英雄");
            return false;
        }
        for(var i in selHeroes){
            hero += selHeroes[i].name+"，";
        }
        console.log(selHeroes);
        console.log(hero)
    }
    
    var sendData = {
        gameType:gameType,
        gameId:314,
        areaId:$(".type-select-area :selected").val(),
        areaName:$(".type-select-area :selected").html(),
        serverId:$(".type-select-serve :selected").val(),
        serverName:$(".type-select-serve :selected").html(),
        inscriptionsLevel:inscriptionsLevel,
        hero: hero = hero.substring(0,hero.length-1),
        startDanType:$(".type-select-dan").eq(0).val(),
        endDanType:$(".type-select-dan").eq(1).val(),
        startDanStar:$(".star-text").eq(0).val(),
        endDanStar:$(".star-text").eq(1).val(),
        cjName:$("#cjName").val(),
        sjsName:$("#dlCon").val(),
        startSld:startSld,
        endSld:endSld,
        startJb:$("#nowGold").val(),
        endJb:$("#targetGold").val(),
        gdContext:$("#fwCon").val()
    };
    console.log(sendData);
    $.ajax({
        url: "/toConsultOfferOrder",
        type: "post",
        dataType: "json",
        data:sendData,
        success: function(data) {
            console.log(data);
            if(data.code == 1){
                layer.msg("即将跳转至咨询页面", {time:1200});
                sessionStorage.setItem("needCon",JSON.stringify(data));
                //var db = JSON.parse(sessionStorage.getItem("needCon"));
                setTimeout(function(){window.location.href="/view/html/chat.html"},1500);
            }else if(data.code == -1){
                layer.msg("暂时没有可分配的商家");
            }else if(data.code == 2){
                layer.msg("即将跳转至咨询页面", {time:1200});
                setTimeout(function(){window.location.href="/view/html/chat.html?rowId="+data.rowId+""},1500);
            }else if(data.code == 88888){
                layer.msg("登录失效", {time:1000});
                localStorage.setItem("setUserInfo",null);
                setTimeout(function(){
                    //iframe层-登录页
                    layer.open({
                        type: 2,
                        title: false,
                        area: ['90%','286px'],
                        shade: 0.5,
                        content: ['/view/html/LoginRegister.html', 'no'],
                        success:function(layero,index){
                            parent.layer.iframeAuto(index);
                        }
                    });
                },1000)
            }else{
                layer.msg(data.msg);
            }
        }
    });
    addCookie(type);
}

/* 点击返回保存已选择的选项到本地(会话) */
function addCookie(type) {
    var setHasVal1,setHasVal2,setHasVal3,setHasVal4,setHasVal5,setHasVal6;
    if(type == 1){
    	console.log($(".type-select-serve").val())
        setHasVal1 = [{
            "type":type,
            "gameArea":$(".type-select-area :selected").val(),
            "gameServer":$(".type-select-serve :selected").val(),
            "nowLv":$(".type-select-dan").eq(0).val(),
            "nowStar":$(".star-text").eq(0).val(),
            "targetLv":$(".type-select-dan").eq(1).val(),
            "mwLv":$("#mwLv").val(),
            "targetStar":$(".star-text").eq(1).val()
        }];
        sessionStorage.setItem("setHasVal1",JSON.stringify(setHasVal1));
    }else if(type == 2){
        setHasVal2 = [{
            "type":type,
            "gameArea":$(".type-select-area :selected").val(),
            "gameServer":$(".type-select-serve :selected").val(),
            "mwLv":$("#mwLv").val(),
            "cjName":$("#cjName").val()
        }];
        sessionStorage.setItem("setHasVal2",JSON.stringify(setHasVal2));
    }else if(type == 3){
        setHasVal3 = [{
            "type":type,
            "gameArea":$(".type-select-area :selected").val(),
            "gameServer":$(".type-select-serve :selected").val(),
            "mwLv":$("#mwLv").val(),
            "dlCon":$("#dlCon").val()
        }];
        sessionStorage.setItem("setHasVal3",JSON.stringify(setHasVal3));
    }else if(type == 4){
        setHasVal4 = [{
            "type":type,
            "gameArea":$(".type-select-area :selected").val(),
            "gameServer":$(".type-select-serve :selected").val(),
            "dlType":$("input[name='type']:checked").val(),
            "dlHero":$("#dlHero>.selected-hero").html(),
            "mwLv40":$("#mwLv40").val(),
            "mwLv45":$("#mwLv45").val(),
            "dlNowProficiency":$("#dlNowProficiency").val(),
            "dlTargetProficiency":$("#dlTargetProficiency").val(),
            "dlNowPower":$("#dlNowPower").val(),
            "dlTargetPower":$("#dlTargetPower").val()
        }];
        sessionStorage.setItem("setHasVal4",JSON.stringify(setHasVal4));
    }else if(type == 5){
        setHasVal5 = [{
            "type":type,
            "gameArea":$(".type-select-area :selected").val(),
            "gameServer":$(".type-select-serve :selected").val(),
            "mwLv":$("#mwLv").val(),
            "nowGold":$("#nowGold").val(),
            "targetGold":$("#targetGold").val()
        }];
        console.log(setHasVal5)
        sessionStorage.setItem("setHasVal5",JSON.stringify(setHasVal5));
    }else if(type == 6){
        setHasVal6 = [{
            "type":type,
            "gameArea":$(".type-select-area :selected").val(),
            "gameServer":$(".type-select-serve :selected").val(),
            "mwLv":$("#mwLv").val(),
            "fwCon":$("#fwCon").val()
        }];
        sessionStorage.setItem("setHasVal6",JSON.stringify(setHasVal6));
    }
}
/* [分类]点击保存保存到本地 */
function classifyCookie(){
    if($("#tank").val() == "" && $("#soldier").val() == "" && $("#assassin").val() == "" && $("#master").val() == "" && $("#shooter").val() == "" && $("#assist").val() == ""){
        layer.msg("未填写内容！");
        return false;
    }else{
    	var classifyType = $("#type").val();
    	var classifyVal1,classifyVal2,classifyVal3,classifyVal4,classifyVal5,classifyVal6;
    	if(classifyType == 1){
    		classifyVal1 = {
    			"type":$("#type").val(),
    			"tank":$("#tank").val(),
    			"soldier":$("#soldier").val(),
    			"assassin":$("#assassin").val(),
    			"master":$("#master").val(),
    			"shooter":$("#shooter").val(),
    			"assist":$("#assist").val()
    		};
    		sessionStorage.setItem("classifyVal1",JSON.stringify(classifyVal1));
    		setTimeout(function(){
    			window.location.href = '/view/html/ranking.html?type='+classifyType;
    		},500);
    	}
    	if(classifyType == 2){
    		classifyVal2 = {
    			"type":$("#type").val(),
    			"tank":$("#tank").val(),
    			"soldier":$("#soldier").val(),
    			"assassin":$("#assassin").val(),
    			"master":$("#master").val(),
    			"shooter":$("#shooter").val(),
    			"assist":$("#assist").val()
    		};
    		sessionStorage.setItem("classifyVal2",JSON.stringify(classifyVal2));
    		setTimeout(function(){
    			window.location.href = '/view/html/achievement.html?type='+classifyType;
    		},500);
    	}
    	if(classifyType == 3){
    		classifyVal3 = {
    			"type":$("#type").val(),
    			"tank":$("#tank").val(),
    			"soldier":$("#soldier").val(),
    			"assassin":$("#assassin").val(),
    			"master":$("#master").val(),
    			"shooter":$("#shooter").val(),
    			"assist":$("#assist").val()
    		};
    		sessionStorage.setItem("classifyVal3",JSON.stringify(classifyVal3));
    		setTimeout(function(){
    			window.location.href = '/view/html/reward.html?type='+classifyType;
    		},500);
    	}
    	if(classifyType == 4){
    		var value=GetQueryString("value");
    		if(value==40){
    			classifyVal4v40 = {
    					"type":$("#type").val(),
    					"tank":$("#tank").val(),
    					"soldier":$("#soldier").val(),
    					"assassin":$("#assassin").val(),
    					"master":$("#master").val(),
    					"shooter":$("#shooter").val(),
    					"assist":$("#assist").val()
    			};
    			sessionStorage.setItem("classifyVal4v40",JSON.stringify(classifyVal4v40));
    		}else{
    			classifyVal4v45 = {
    					"type":$("#type").val(),
    					"tank":$("#tank").val(),
    					"soldier":$("#soldier").val(),
    					"assassin":$("#assassin").val(),
    					"master":$("#master").val(),
    					"shooter":$("#shooter").val(),
    					"assist":$("#assist").val()
    			};
    			sessionStorage.setItem("classifyVal4v45",JSON.stringify(classifyVal4v45));
    		}
    		setTimeout(function(){
    			window.location.href = '/view/html/proficiency.html?type='+classifyType;
    		},500);
    	}
    	if(classifyType == 5){
    		classifyVal5 = {
    			"type":$("#type").val(),
    			"tank":$("#tank").val(),
    			"soldier":$("#soldier").val(),
    			"assassin":$("#assassin").val(),
    			"master":$("#master").val(),
    			"shooter":$("#shooter").val(),
    			"assist":$("#assist").val()
    		};
    		sessionStorage.setItem("classifyVal5",JSON.stringify(classifyVal5));
    		setTimeout(function(){
    			window.location.href = '/view/html/goldCoin.html?type='+classifyType;
    		},500);
    	}
    	if(classifyType == 6){
    		classifyVal6 = {
    			"type":$("#type").val(),
    			"tank":$("#tank").val(),
    			"soldier":$("#soldier").val(),
    			"assassin":$("#assassin").val(),
    			"master":$("#master").val(),
    			"shooter":$("#shooter").val(),
    			"assist":$("#assist").val()
    		};
    		sessionStorage.setItem("classifyVal6",JSON.stringify(classifyVal6));
    		setTimeout(function(){
    			window.location.href = '/view/html/more.html?type='+classifyType;
    		},500);
    	}
    	layer.msg("保存成功！");
    }
}


//六个类型页面获取类型填写每个具体值，赋值给相应隐藏域
function typeClassify(type){
	if(type==4){
        var classifyVal4v40 = JSON.parse(sessionStorage.getItem("classifyVal4v40"));
        console.log(classifyVal4v40)
        if(classifyVal4v40 != null) {
            if(classifyVal4v40.tank != ""){
                $("#mwLv40").val(classifyVal4v40.tank);
            }else if(classifyVal4v40.soldier != ""){
                $("#mwLv40").val(classifyVal4v40.soldier);
            }else if(classifyVal4v40.assassin!= ""){
                $("#mwLv40").val(classifyVal4v40.assassin);
            }else if(classifyVal4v40.master != ""){
                $("#mwLv40").val(classifyVal4v40.master);
            }else if(classifyVal4v40.shooter != ""){
                $("#mwLv40").val(classifyVal4v40.shooter);
            }else if(classifyVal4v40.assist != ""){
                $("#mwLv40").val(classifyVal4v40.assist);
            }
        }
		var classifyVal4v45 = JSON.parse(sessionStorage.getItem("classifyVal4v45"));
		console.log(classifyVal4v45)
		if(classifyVal4v45 != null) {
		    if(classifyVal4v45.tank != ""){
		    $("#mwLv45").val(classifyVal4v45.tank);
		}else if(classifyVal4v45.soldier != ""){
		    $("#mwLv45").val(classifyVal4v45.soldier);
		}else if(classifyVal4v45.assassin!= ""){
		    $("#mwLv45").val(classifyVal4v45.assassin);
		}else if(classifyVal4v45.master != ""){
		    $("#mwLv45").val(classifyVal4v45.master);
		}else if(classifyVal4v45.shooter != ""){
		    $("#mwLv45").val(classifyVal4v45.shooter);
		}else if(classifyVal4v45.assist != ""){
		    $("#mwLv45").val(classifyVal4v45.assist);
		    }
		}
	}else{
		var classifyVal = JSON.parse(sessionStorage.getItem("classifyVal"+type));
		if(classifyVal != null) {
			console.log(classifyVal.soldier);
			$("#tank").val(classifyVal.tank);
			$("#soldier").val(classifyVal.soldier);
			$("#assassin").val(classifyVal.assassin);
			$("#master").val(classifyVal.master);
			$("#shooter").val(classifyVal.shooter);
			$("#assist").val(classifyVal.assist);
			if($("#tank").val() != ""){
				$("#mwLv").val($("#tank").val());
			}else if($("#soldier").val() != ""){
				$("#mwLv").val($("#soldier").val());
			}else if($("#assassin").val() != ""){
				$("#mwLv").val($("#assassin").val());
			}else if($("#master").val() != ""){
				$("#mwLv").val($("#master").val());
			}else if($("#shooter").val() != ""){
				$("#mwLv").val($("#shooter").val());
			}else if($("#assist").val() != ""){
				$("#mwLv").val($("#assist").val());
			}
		}	
	}
	
}




/* [分类]页不同按钮的不同处理事件 */
function typePageBtnEvent(type,obj) {
	addCookie(type);
	if(obj.id.indexOf("classifyItem")==0){//分类按钮
		if(type==4){//熟练度页面
			var value=obj.id.slice(12);
			window.location.href = '/view/html/classify.html?type='+type+'&value='+value;
		}else{
			window.location.href = '/view/html/classify.html?type='+type;
		}
	}else if(obj.id=="heroItem"){//已有英雄按钮
		window.location.href = '/view/html/chooseHero.html?type='+type;
	}else if(obj.id.indexOf("selectHeroBtn")==0){//熟练度指定英雄按钮
		var value=obj.id.slice(13);
		window.location.href = '/view/html/chooseHero.html?type='+type+'&value='+value;
	}else if(obj.id=="typeReturn"){//头部返回按钮
		window.location.href = '/view/html/index.html';
	}
}

/* [分类]页面初始化，为不同按钮增加点击事件 */
typePageBtnAddEvent();
function typePageBtnAddEvent(){
	var type=GetQueryString("type");
	$(document).on("click","#heroItem,#typeReturn,[id^='classifyItem'],[id^='selectHeroBtn']",function(){
		typePageBtnEvent(type,this);
	})
}

//$(".c_body").css("min-height",$(window).height());//页面最小高度等于屏幕高


