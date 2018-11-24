$(function () {

    var picArr = []; //用于存储上传的文件信息
    //1.进如页面开始渲染
    var currentPage = 1;
    var pageSize = 2;
    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize,

            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                //   模板和数据连接
                var htmlStr = template("productTpl", info);
                // 将数据展现到tbody中
                $('tbody').html(htmlStr);

                // 实现更新每一面的渲染
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page, //当前页
                    totalPages: Math.ceil(info.total / info.size), //总页数
                    // size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (a, b, c, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render();
                    }
                });
            }
        })
    }

    //2.点击添加商品按钮，跳出模态框,并且下拉菜单开始渲染
    $(".addBtn").click(function () {
        //模态框显示
        $("#productModal").modal('show');
        //下拉菜单的渲染
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100,
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                // 连接数据域模板
                var htmlStr = template("productTal", info);
                // 添加到ul里面
                $('.dropdown-menu').html(htmlStr);
            }
        })

    })

    //3.点击下拉菜单中的选项，是按钮的内容为所选的选项内容
    $('.dropdown-menu').on("click", "a", function () {
        //获取内容
        var txt = $(this).text();

        //将内容赋值给span
        $("#productText").text(txt);
        //获取各个a的brandId
        var id = $(this).data('id');
        //赋值给对应的隐藏于，由隐藏域上传到后台
        $('[name="brandId"]').val(id);
        //重置状态
        $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");

    })


    //4.配置fileupload.实现表单上传
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            //   console.log(data);
            //获取图片信息（picName/picAddr）
            var picObj = data.result;
            console.log(picObj);
            /*在本例中，文件上传最多为3个，然后每添加一个文件，原文件中的最后一个文件就会被删除；
          添加的文件从前面添加；
           如何将原文件中的最后一个文件就会被删除；在数组中删掉它的最后一个路径
        
          */

            //往数组的最前面添加
            picArr.unshift(picObj);
            console.log(picArr);
            //获取图片地址，将图片添加到结构的最前面
            var picUrl = picObj.picAddr;
            $('#imgBox').prepend('<img src="' + picUrl + '" style="width:100px;">');
            if (picArr.length > 3) {
                //删除最后一项
                picArr.pop();
                //结构中删除最后一张照片
                // $('#imgBox img:last-child')  // 找最后一个孩子, 再判断是不是 img 类型
                // $('#imgBox img:last-of-type');  // 找到最后一个img类型的元素, 让他自杀
                // $('#imgBox img').eq( $('#imgBox img').length-1 )
                $('#imgBox img:last-of-type').remove();
            } 
            // console.log(picArr);
            //重置状态
            if(picArr.length===3){
                $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");

            }
        }

    });

            //5表单校验功能
            //使用表单校验插件
$('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          },
         
        }
      },
      proName:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品名称'
            }, 
          }
      },
      proDesc:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品描述'
            }, 
          }
      },
      num:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品库存'
            }, 
            regexp:{
                regexp:/^[1-9]\d*$/,
                message:"商品库存必须是非零开头的数字"
            }
          }
      },
      size:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品尺码'
            }, 
            regexp:{
                regexp:/^\d{2}-\d{2}$/,
                message:"必须是xx-xx的格式, xx是两位数字, 例如: 36-44"
            }
          }
      },
      oldPrice:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品原价'
            }, 
          }
      },
      price:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请输入商品现价'
            }, 
          }
      },
      picStatus:{
        validators: {
            //不能为空
            notEmpty: {
              message: '请上传3张图片'
            }
          }
      }

    }
  
  });

   //7.校验成功时，点击提交按钮将表单信息上传，首先阻止默认提交
   $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    //先获取表单基本信息
    var paramsStr=$("#form").serialize();
     console.log(paramsStr);
    // //拼接图片信息（图片地址和名称）
    paramsStr+="&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
    paramsStr+="&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
    paramsStr+="&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;
    $.ajax({
        type:"post",
        url:"/product/addProduct",
        /*这里由于时多文件上传，而且后台还要接收到上传图片的信息
         要想将所有文件的信息都传至后台，可以采用拼接的方法将所有
         图片的信息拼接到获取的表单信息的后面，一块上传

        */
        data:paramsStr,
        dataType:"json",
        success:function(info){
            //关闭模态框
            $('#productModal').modal('hide');
            //渲染以第一页
            currentPage=1;
            render();
            //重置所有的表单内容和状态
            $("#form").data('bootstrapValidator').resetForm(true);
            //由于下拉菜单和图片不是表单元素，需要手动重置内容
            $('#productText').text("请选择二级分类");
            $('#imgBox img').remove();
            picArr=[];
        }
    })
});

    



})