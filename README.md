# Srouter
>一个不需要依赖框架的简单路由,针对轻量级项目而不需要依赖框架的情况

## 适用情况
|<a>标签中href(hash值) |       传入path值      |     获取参数             |
|----------------------|:---------------------:|:------------------------:|
|     /            	   |    /	               | 		{}                |
|     /page            |    /page     	       |  		{}                |
|     /2333 	       |    /{uid}      	   |   	 {uid:'2333'}         |
|/list?page=10&line=20 |    /list     		   |{page:'10',line:'20'}	  |
|/2333/history         |    /{uid}/history     |{uid:'2333'}              |
|/2333/history?page=10 |    /{uid}/history     | {uid:'2333',page:'10'}   |

### 需要注意
* /list?page=10&line=20/history ， 不支持在已经有get参数形式之后再追加子路由，虽然可以实现但不支持这么做。
* hash:/2333/history?page=10 ,path: /{page}/history => {page:'2333'}。  当单值参数作为单独路由出现，之后的所有get参数重名将被覆盖，解决方法是：好好命名。


### 示例
  ``` javascript

    var pageRouter = new Srouter({
        dom_box:document.getElementById('dom_box'),
        router:[
            {
                path: '/',
                noFind: true,
                enter: function (insetDomFn, parms) {
                    insetDomFn('<div>/</div>');
                }
            },
            {
                path: '/pageA',
                enter: function (insetDomFn, parms) {
                    insetDomFn('<div>pageA</div>');
                }
            },
            {
                path: '/user/{id}/foo',
                enter: function (insetDomFn, parms) {
                    new Promise(function(resolve, reject){
                        //像一个地址请求数据并附带 parms参数内的 id:xxx
                        //返回成功后调用resolve(responsetext),对应then;
                        //返回失败后调用reject(new Error(this.statusText))，对应catch
                    }).then( (html) => {
                        insetDomFn(html);
                    }).catch( (error) => {
                        insetDomFn('<div>' + error + '</div>');
                    })
                },
                leavel: function () {
                  //do something you want when you leavel this path
                }
            }
        ]
    });
    
    pageRouter.push('/pageA'); //去指定path地址
```
### 参数说明
|参数                  |	类型	|       说明        													|
|:---------------------|:-----------|:----------------------------------------------------------------------|
|dom_box               |   DOM		|**必传**    需要传递 需要挂载的HTML元素    							|
|router                |   Array	|**必传**	路由组                 										|
|router.path           |   String	|**必传**	需要匹配的路由地址     										|
|router.noFind         |   Boolean  |**可选**	当未匹配到路由时的路由，默认路由组第一个，切GET类型参数屏蔽 |
|router.enter          |   Function |**必传**	当该路由地址进入时,该方法自带传入了两个参数   				|
|router.leavel         |   Function |**可选**	当该路由地址离开时     										|
#### router.enter特别说明
|argument              |	类型	|       说明        													|
|:---------------------|:-----------|:----------------------------------------------------------------------|
|1：insetDomFn         |   Function	|需要挂载的HTML载入到目标元素 例：insetDomFn('<div></div>')    		    |
|2：parms              |   Obejct	|该路由匹配到时的单参数及GET类型参数：列：path：'/2333/history?page=10' , parms :{uid:'2333',page:'10'}|

