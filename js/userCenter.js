/**
 * Created by CH on 2017/4/26.
 */
/* 页面加载根据登录信息获取个人资料 */
(function(){
    $.ajax({
        url: "/getUserInfo",
        type: "post",
        dataType: "json",
        success: function(data) {
            if(data.code == 1){
                var db = data.user;
                console.log(db);
                if(db.payPasswordFlag == 0){
                    $("#payPwd").html("开启支付密码");
                    $("#openOrchange").html("开启支付密码");
                }else if(db.payPasswordFlag == 1){
                    $("#payPwd").html("修改支付密码");
                    $("#openOrchange").html("修改支付密码");
                }
                if(db.realFlag == 0){
                    $("#realFlag").html("未认证");
                    $("#realFlagNo").show();
                    $("#realFlagPhone").html(db.userPhone);
                    $("#realFlagYes").hide();
                }else if(db.realFlag == 1){
                    $("#realFlag").html("已认证");
                    $("#realFlagYes").show();
                    $("#realFlagNo").hide();
                }
                $("#userPhone").html(db.userPhone);
                $("#smsUserPhone").val(db.userPhone);
                if($("#payUserPhone").val() != null || $("#payUserPhone").val() != null){
                    /* 页面加载发送手机验证码 */
                    sendPhoneCode();
                }
            }else if(data.code == 88888){
                layer.msg("登录失效");
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
            }
        }
    });
    /* 点击下一步按钮 */
    $("#nextHandle").click();
    function nextHandle() {

    }
    function sendPhoneCode() {
        $.ajax({
            url: "/sendPhoneCode_NL",
            type: "post",
            data:{sentType:80,mobile:$("#smsUserPhone").val()},
            dataType: "json",
            success: function(data) {
                console.log(data);
                if(data.code == 1){
                    layer.msg("发送成功");
                }else{
                    layer.msg(data.msg);
                }
            }
        })
    }
})();









