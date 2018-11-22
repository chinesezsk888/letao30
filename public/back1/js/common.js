;
(function () {
    /*
    1.进度条是每个页面进去时都有的，表示该页面正在加载（也表示后台接收ajax的响应时间），
    所以单独写在一个js文件中
    
    2.进度条的出现时间是在向后台发送ajax请求后出现的，当请求得到相应后进度条消失；
    3.在第一个ajax请求发送的时候，开启进度条
    4.在全部的ajax请求完成时，关闭进度条
    这就涉及到了ajax全局事件
    ajaxComplete() 再每个ajax发送请求时调用（不管请求成功还是失败）
    ajaxSuccess()：在每个ajax请求成功时调用
    ajaxError()：在每个ajax请求失败时调用
    ajaxSend()：在每个aja即将发送请求时调用

    ajaxStop()：在所有-ajax请求完成时调用
    ajaxStart()：在第一个ajax请求发送时调用
     */
    $(document).ajaxStart(function(){
        //开启进度条
        NProgress.start();
    })
    $(document).ajaxStop(function(){
        //关闭进度条
        NProgress.done();
    })

})();


// 公共功能
 //1.左侧二级菜单切换功能
 $('#category').click(function(){
     $(this).next().stop().slideToggle(400);
 })
 //2.左侧菜单切换功能
 $(".header .pull-left").click(function(){
     $('.lt_aside').toggleClass("hidemenu");
     $('.header').toggleClass("hidemenu");
     $('.main').toggleClass("hidemenu");
 })
 //3.模态框
 $('.pull-right').click(function(){
    $('#myModal').modal('show');
 })
 //3.1点击取消按钮，退出模态框
 $('.modal-footer .btn-default').click(function(){
    $('#myModal').modal('hide');
 })
 /*3.2点击退出按钮，退出到用户重新登入页面，
 所谓重新登入就是点击退出按钮后，后台注销当前用户的登入状态，
 前端要做就是获取接口
 
*/
 $('#commonBtn').click(function(){
   $.ajax({
       type:"get",
       url:"/employee/employeeLogout",
       dataType:"json",
       success:function(info){
        //    console.log(info);
         if(info.success){
        // 销毁登录状态成功, 退出成功, 跳转登录页
        location.href="login.html";
         }
       }
   })
 })