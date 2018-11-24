//1.渲染页面
$(function () {
    var currentPage = 1; //当前页
    var pageSize = 5; //每页条数

    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("secondTpl", info);
                $('tbody').html(htmlStr);

                //分页的渲染
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

    //2.点击添加按钮模态框显示
    $('#addList').click(function(){
        $('#secondModal').modal('show');
        // 点击添加按钮同发送请求，渲染出下拉菜单的数据
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100,
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                // 将返回的数据和模板连接起来
                var htmlStr=template("dropdownTpl",info);
                //添加到要添加的地方
                $(".dropdown-menu").html(htmlStr);

            }

        })
    });
    //由于此处的下拉词菜单是个组件由按钮和ul组成，所以它原本是没有自动显示下拉菜单的内容的功效，只能手动添加
   //3.点击下拉菜单的选项，下拉菜单的按钮显示的内容于之相同
   $('.dropdown-menu').on("click","a",function(){
       //获取被点击的下拉菜单的内容
       var txt=$(this).text();
       //添加到下拉菜单的按钮中
       $('#secondAdd').text(txt);
       /*由于下拉菜单的按钮时没有提交功能的。所以这里利用隐藏域对添加的一级目录进行上传，
       而不同的一级目录对应不同的id,所以只要上传id即可*/
    //    console.log($(this));
    //    var id=$(this).context.dataset.id;
           var id=$(this).data("id");
           console.log(id);
    //    console.log(id);
       //将id上传至隐藏域，由隐藏域上传到后台从而确定添加的是什么一级目录
       $('[name="categoryId"]').val(id);
    //    console.log($('[name="categoryId"]').val());
       //重置隐藏域的校验状态
       $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");


   })

  // 4. 调用 fileUpload 方法, 发送文件上传请求
  //初始化文件上传
$("#fileupload").fileupload({
    dataType:"json",
    //文件上传完成时，会执行的回调函数，通过这个函数就能获取到图片的地址
    //第二个参数就有上传的结果 data.result
    done:function (e, data) {
      //console.log("图片上传完成拉");
    //   console.log(data);
      //console.log(data.result.picAddr);
      var result=data.result;
      console.log(result)
      var picAddr=result.picAddr;
      $("#imgBox img").attr("src",picAddr);
      //// 将图片地址赋值给隐藏域,有隐藏域作为ajax请求发送给后台

      $("[name='brandLogo']").val(picAddr);
     //重置隐藏域的校验状态
     $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
})
//5.表单的校验
    
$('#form').bootstrapValidator({
    // 5.1bootstrapValidator插件是默认对表单中的隐藏域（:hidden）、禁用域（:disabled）、不可见域（:not (visible)）”是不进行验证的。
    //而在本项目中需要对隐藏域进行校验，
    excluded: [],
    //表示被校验的字段，这里为空，就说明包括隐藏域（:hidden）、禁用域（:disabled）、不可见域（:not (visible)）也会被校验

    //5.2 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok', //校验成功
        invalid: 'glyphicon glyphicon-remove', //校验失败
        validating: 'glyphicon glyphicon-refresh' //校验中 
    },

    //5.3指定检验字段
    fields:{
        //校验用户名，对应的name表单的name属性
        categoryId:{
            //配置校验规则
            validators:{
                //配置非空校验
                notEmpty:{
                    message:"请输入一级分类名称"
                }
            }
        },
        brandName:{
            validators:{
                notEmpty:{
                    message:"请输入二级分类名称"
                }
            }
        },
        brandLogo:{
            validators:{
                notEmpty:{
                    message:"请上传图片"
                }
            }
        }

    },

})

//6.点击模态框的添加按钮，重新渲染分页
$('#form').on("success.form.bv", function (e) {
    //禁止表单的默认提交
    e.preventDefault();
    $.ajax({
        type: "post",
        url: "/category/addSecondCategory",
        dataType: "json",
        data: $("#form").serialize(),
        success: function (info) {
            if (info.success) {
                //添加成功，关闭模态框

                $('#secondModal').modal('hide');
                //重新渲染页面,由于要求从前面添加，所以渲染第一页即可
                currentPage = 1;
                render();
                //表单内容和状态重置
                $("#form").data("bootstrapValidator").resetForm(true);
                //下拉菜单的手动重置　
                $('#secondAdd').text("请输入一级目录");
                //图片显示区的重置
                $('#imgBox img').attr("src","./images/none.png");
            }
        }
    }) 
})



});