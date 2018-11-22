// 入口函数
//分页的需求：
// 1.一经入首页就渲染一次数据
// 2.点击代表页数的按钮，渲染相应的页数数据；
// 3. 模态框的效果实现：点击取消，模态框消失；点击确认表格的按钮进行相应的变化


$(function () {
    // 一进入页面就渲染一次
    var currentPage = 1; //当前页
    var pageSize = 5; //每页条数
    render();
    //创建渲染函数
    function render() {

        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                // 将模板于数据连接
                var htmlStr = template("userTpl", info);
                //将数据显示到页面中
                $("tbody").html(htmlStr);

                //分页插件测试
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
        });


    }

     var id;   //记录当前编辑的用户 id
     var isDelete;  // 修改的状态
    //点击按钮利用事件委托
    //点击按钮模态框显示
    $('tbody').on('click', '.btn', function () {
        $('#userModal').modal('show');
        //获取相应的id
         id = $(this).parent().data('id');
        //获取对应的isDelete,并转换
        isDelete= $(this).hasClass('btn-danger')?0:1;
    //    console.log(isDelete);
    //     console.log(id);

    })
   
    //点击模态框的确定按钮，表格的按钮有禁用变成启用，由启用变成禁用
    $('#submitBtn').click(function(){
        // $('#userModal').modal('hide');
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:id,
                isDelete:isDelete,
            },
            dataType:"json",
            success:function(info){
                if(info.success){
                    $('#userModal').modal('hide'); 
                    //重新渲染页面
                   render();
                }
               
            }
        })
    })


    //点击模态框的取消按钮.模态框消失
    // $('.modal-footer .user-default').click(function () {
    //     $('#userModal').modal('hide');
    // })

    //点击模态框的确定按钮，将启用的变成禁用，将禁用的变成启用
});