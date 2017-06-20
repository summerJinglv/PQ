/**
 * Created by CH on 2017/4/17.
 */

/* 登录注册页面验证调用部分 */
(function(){
    var userPhone = $("#userPhone");
    var getCode = $("#getCode");
    var loginState = $("#loginState");
    var loginNeedImg = $("#loginNeedImg");
    var codeKey;
    /* input获取焦点得到光圈 */
    $("input[type = 'text']").focus(function(){$(this).addClass("inputFocus");});
    $("input[type = 'text']").blur(function(){$(this).removeClass("inputFocus");});
    /* 未填写手机号,获取按钮为灰色不可点击 */
    userPhone.blur(judgeuserPhone);
    /* 监听手机号码(人性化) */
    userPhone.bind('input oninput',listenuserPhone);
    /* 未同意协议按钮不可点击 */
    $("#checkAgreement").change(notCheckAgreement);
    /* 登录注册切换 */
    $("#c_lrBoxTab").click(curLR);
    /* 登录按钮点击时 */
    $("#login").click(saveUserInfo);
    /* 点击获取验证码 */
    getCode.click(getMessage);
    var num = 60;
    /* 点击图片刷新图片验证码 */
    $("#imgCodePic").click(getImgCode);
    /* 短信验证码自动监听输入完成 */
    $("#imgCode").bind('input oninput',listenuserCode);


    /*
     *  登录注册函数高发区
     */
    function getMessage(){
        getCode.attr("disabled",true);
        $.ajax({
            url: "/sendPhoneCode_NL",
            type: "post",
            data:{mobile:userPhone.val(),sentType:100,codeKey:codeKey,imgCaptcha:$("#imgCode").val()},
            dataType: "json",
            success: function(data) {
                console.log(data);
                if(data.code == 1){
                    layer.msg("发送成功");
                    /* 开始倒计时 */
                    time();
                    $("#saveImgCode").val($("#imgCode").val());
                    $("#imgCode").val("");
                    layer.closeAll('page');
                }else if(data.code == 403){
                    layer.msg("图片验证码不能为空");
                    getCode.removeAttr("disabled");
                }else if(data.code == 512){
                    getImgCode();
                    $("#imgCode").val("");
                    layer.msg("图片验证码错误");
                    getCode.removeAttr("disabled");
                }else{
                    layer.msg(data.msg);
                    getCode.removeAttr("disabled");
                    getImgCode();
                }
            }
        });
    }
    getImgCode();
    /* 获取图片验证码 */
    function getImgCode(){
        /* 产生六位随机数 */
        codeKey = generateMixed(6);
        function generateMixed(n) {
            var numId = "";
            for(var i = 0; i < n ; i ++) {
                numId += Math.floor(Math.random() * 10);
            }
           return numId;
        }
        /* 动态获取 3yx 地址(测试,准正式,正式) */
        $.ajax({
            url: "/getPassportApiUrl_NL",
            type: "post",
            dataType: "json",
            success: function(data) {
                if(data.code == 1){
                    console.log("图片验证码地址: ===");
                    console.log(data.passportApiUrl);
                    var url3yx = data.passportApiUrl;
                    /* url地址 */
                    var ImgCodeUrl = url3yx+"/api/user/getImgCaptcha?appId=110&codeKey="+codeKey;
                    $("#imgCodePic").attr("src",ImgCodeUrl);
                    return codeKey;
                }
            }
        });
    }
    function time() {
        if(num == 0){
            getCode.html("获取验证码").removeClass("aui-btn-disabled").removeAttr("disabled");
            num = 60;
        }else{
            getCode.addClass("aui-btn-disabled").attr("disabled",true).html(num+" s");
            num--;
            setTimeout(function(){
                time();
            }, 1000);
        }
    }
    function curLR(){
        if(loginState.val() == 0){
            $("#c_message").hide();
            $("#c_3yx").show();
            $(this).html("短信验证码登录");
            $(".c_tips").html(" &nbsp;&nbsp;&nbsp;&nbsp;");
            loginState.val(1);
        }else if(loginState.val() == 1){
            $("#c_3yx").hide();
            $("#c_message").show();
            $(this).html("账号密码登录");
            $(".c_tips").html("未注册手机将自动创建新账号");
            loginState.val(0);
        }
    }
    function notCheckAgreement(){
        if(!($("#checkAgreement").is(":checked"))){
            $("#login").addClass("aui-btn-disabled").attr("disabled",true);
        }else{
            $("#login").removeClass("aui-btn-disabled").removeAttr("disabled");
        }
    }
    function judgeuserPhone(){
        if(userPhone.val() == "" || userPhone.val() == null){
            getCode.addClass("aui-btn-disabled").attr("disabled",true);
        }else if(!(/^1[345678]\d{9}$/.test(userPhone.val()))){
            layer.msg("手机号码输入有误");
            userPhone.val("")
        }
    }

    function listenuserCode(){
        if($("#imgCode").val() != "" && $("#imgCode").val().length == 4 ){
        	$("#saveImgCode").val($("#imgCode").val());
            if(loginNeedImg.val() == 1){
                saveUserInfo();
            }else if(loginNeedImg.val() == 0){
                getMessage();
            }
        }
    }

    function listenuserPhone() {
        if(/^1[345678]\d{9}$/.test(userPhone.val())){
            /* 监听是否需要短信验证码 */
            $.ajax({
                url: "/checkNeedImgCode_NL",
                type: "post",
                data:{mobile:userPhone.val(),sentType:100},
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    if(data.code == 1){
                        if($("#imgCode").val() == null || $("#imgCode").val() == ''){
                            //捕获页 需要图片验证码
                        	layer.open({
                        		type: 1,
                        		title: false, //不显示标题
                        		area: ['75%', '170px'], //宽高
                        		content: $('.c_imgCode'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                        	});
                            $("#imgCode").css("autofocus");
                            //parent.layer.iframeAuto(parent.layer.getFrameIndex(window.name));
                        }
                    }else if(data.code == 0){
                        //不需要图片验证码
                    	getCode.removeClass("aui-btn-disabled").removeAttr("disabled");
                    }
                }
            });
        }else{
            getCode.addClass("aui-btn-disabled").attr("disabled",true);
            getCode.html("获取验证码");
        }
    }
    function saveUserInfo(){
        /* 判断非空 */
        /* 判断登录形式 0验证码 1密码 */
        if(loginState.val() == 0){
            if(userPhone.val() == "" || userPhone.val() == null){
                layer.msg("请输入手机号");
                return false;
            }else if($("#userCode").val() == "" || $("#userCode").val() == null){
                layer.msg("请输入验证码");
                return false;
            }else{
                /* 判断手机验证码是否正确 */
                var sendData = {mobile:userPhone.val(),smsCaptcha:$("#userCode").val()};
                $.ajax({
                    url: "/smsLoginOrRegist_NL",
                    type: "post",
                    data:sendData,
                    dataType: "json",
                    success: function(data) {
                        console.log(data);
                        if(data.code == 1){
                            layer.msg("登录成功");
                            var setUserInfo = [{"userPhone":$("#userPhone").val(),"userPassword":$("#userPassword").val(),"uesrCode":$("#userCode").val()}];
                            localStorage.setItem("setUserInfo",JSON.stringify(setUserInfo));
                            setTimeout("parent.location.reload()", 1000);
                        }else if(data.code == 512){
                            getImgCode();
                            layer.msg("图片验证码错误");
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                });
            }
        }else if(loginState.val() == 1){
            if($("#userName").val() == "" || $("#userName").val() == null){
                layer.msg("请输入账号");
                return false;
            }else if($("#userPassword").val() == "" || $("#userPassword").val() == null){
                layer.msg("请输入密码");
                return false;
            }else{
                /* 3YX账号登录 */
                if(loginNeedImg.val() == 0){
                    $.ajax({
                        url: "/pwdLogin_NL",
                        type: "post",
                        data:{userAccount:$("#userName").val(),pwd:$("#userPassword").val()},
                        dataType: "json",
                        success: function(data) {
                            console.log(data);
                            if(data.code == 1){
                                layer.msg("登录成功");
                                var setUserInfo = [{"userName":$("#userName").val(),"userPassword":$("#userPassword").val(),"uesrCode":$("#userCode").val()}];
                                localStorage.setItem("setUserInfo",JSON.stringify(setUserInfo));
                                setTimeout("parent.location.reload()", 1000);
                            }else if(data.code == 601 && JSON.parse(data.data).yzmcode == 0){
                                layer.msg(data.msg);
                            }else if(data.code == 601 && JSON.parse(data.data).yzmcode == 1){
                                layer.msg(data.msg);
                                //parent.layer.iframeAuto(parent.layer.getFrameIndex(window.name));
                                loginNeedImg.val(1);
                            }else{
                                layer.msg(data.msg);
                            }
                        }
                    });
                }else if(loginNeedImg.val() == 1){
                    //捕获页 需要短信验证码
                    if($("#threeFour").val() == 0){
                        $("#threeFour").val(1);
                        layer.open({
                        	type: 1,
                        	title: false, //不显示标题
                        	area: ['75%', '170px'], //宽高
                        	content: $('.c_imgCode'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                        });
                        $("#imgCode").css("autofocus");
                        return false;
                    }
                    var db = {userAccount:$("#userName").val(),pwd:$("#userPassword").val(),codeKey:codeKey,imgCaptcha:$("#saveImgCode").val()};
                    
                    $.ajax({
                        url: "/pwdLogin_NL",
                        type: "post",
                        data:db,
                        dataType: "json",
                        success: function(data) {
                            console.log(data);
                            if(data.code == 1){
                                layer.msg("登录成功");
                                var setUserInfo = [{"userName":$("#userName").val(),"userPassword":$("#userPassword").val(),"uesrCode":$("#userCode").val()}];
                                localStorage.setItem("setUserInfo",JSON.stringify(setUserInfo));
                                setTimeout("parent.location.reload()", 1000);
                            }else if(data.code == 602){
                            	getImgCode();
                            	$("#imgCode").val("")
                            	layer.msg(data.msg);
                            }else{
                                layer.msg(data.msg);
                                $("#imgCode").val("");
                                $("#threeFour").val(0);
                                layer.closeAll('page');
                                getImgCode();
                            }
                        }
                    });
                }
            }
        }
    }
})();



