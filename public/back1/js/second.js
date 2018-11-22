//渲染页面
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


})