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