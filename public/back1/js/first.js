$(function () {
    var currentPage = 1; //第一页
    var pageSize = 5; //每页条数


    // 1.一进入便开始渲染
    render();

    function render() {


        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize,

            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("firstTpl", info);
                $('tbody').html(htmlStr);

                // 分页插件实现效果
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page, //当前页，颜色为篮色
                    totalPages: Math.ceil(info.total / info.size), //总页数,向上取整
                    // size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (a, b, c, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page; //更新当前页
                        //每点击一个按钮，就渲染一次
                        render();
                    }
                });
            }

        })


    }

    //2. 模态框显示
    $('#addList').click(function () {
        $('#firstModal').modal('show');
    })

    //3.表单的校验功能
    
    $('#form').bootstrapValidator({
        //3.1 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', //校验成功
            invalid: 'glyphicon glyphicon-remove', //校验失败
            validating: 'glyphicon glyphicon-refresh' //校验中 
        },

        //3.2指定检验字段
        fields:{
            //校验用户名，对应的name表单的name属性
            categoryName:{
                //配置校验规则
                validators:{
                    //配置非空校验
                    notEmpty:{
                        message:"请输入一级分类名称"

                    }
                }
            }
        }






    });





    //4.表单校验功能成功,首先组织表单的默认提交，通过ajax提交
    $('#form').on("success.form.bv", function (e) {
        //禁止表单的默认提交
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            dataType: "json",
            data: $("#form").serialize(),
            success: function (info) {
                if (info.success) {
                    //添加成功，关闭模态框

                    $('#firstModal').modal('hide');
                    //重新渲染页面,由于要求从前面添加，所以渲染第一页即可
                    currentPage = 1;
                    render();
                    //表单内容和状态重置
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }
        })
    })



})