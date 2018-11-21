$(function () {
    // 1.对bootstrap的表单进行校验
    // 要求：1.用户名不能为空 长度为2-6位
    //       2. 密码不能为空 长度为6-12位
    $('#form').bootstrapValidator({

        //1. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', //校验成功
            invalid: 'glyphicon glyphicon-remove', //校验失败
            validating: 'glyphicon glyphicon-refresh' //校验中 
        },


        //2. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        //提示信息
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度在2到6之间'
                    },
                    callback:{
                        message:"用户名不存在",
                    }

                }


            },
            //密码校验
            password: {
                validators: {
                    //不能为空
                    notEmpty: {
                        //提示信息
                        message: '密码不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度在6到12之间'
                    },
                    //专门用于ajax回调提示的说明
                    callback:{
                        message:"密码错误",
                    }
                }
            },
        }

    })

    //2.注册表单校验成功事件, 在事件中阻止默认成功的表单提交,
    //通过 ajax 进行提交

    $('#form').on("success.form.bv", function (e) {

        // 禁止表单的自动提交
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $("#form").serialize(),
            dataType: "json",
            success: function (info) {
                //  console.log(info);
                if (info.success) {
                    location.href = "index.html";

                }
                if (info.error === 1000) {
                    //用户名不存在
                    // alert(info.message);
                    
                    $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
                }
                if (info.error === 1001) {
                    //密码错误
                    // alert(info.message);
                    
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
            }


        })



    })

   /*3.重置功能（reset重置按钮本身就可以重置内容，
   但是在这里还要重置表单的状态，需要调用表单校验插件的方法
   ）*/
    $('[type="reset"]').click(function(){
        // 重置状态
    // resetForm 如果传 true  表示内容和状态都重置
    //           不传参,      只重置状态
    
    $("#form").data("bootstrapValidator").resetForm();

    })




})