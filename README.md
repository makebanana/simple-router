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

## 如何使用
> * 兼容到**IE8**的版本，不通过工具直接在页面中引入<scrpit>
> * **ES6**版本， 直接通过**import Srouter from './src/js/es6.srouter''**

### 示例
  ``` javascript

     new Srouter({
      dom_box:document.getElementById('dom_box'),
      router:[
          {path:'/',noFind:true,enter:function(insetDomFn,parms,router){

          }},
          {path:'/pageA',enter:function(insetDomFn,parms,router){

          }},
          {path:'/user/{id}/foo',enter:function(insetDomFn,parms,router){

          },leavel:function(){
            //do something you want when you leavel this path
          }}
      ]
  })'
```
### 参数说明
|参数                  |       参数说明        |
|----------------------|:---------------------:|
|dom_box               |需要传递 需要挂载的HTML元素    |
|router                |路由组                 |
|router.path           |需要匹配的路由地址     |
|router.noFind         |当未匹配到正确路由时，是否将当前路由设置为404页面|
|router.enter          |当该路由地址进入时     |
|router.leavel         |当该路由地址离开时     |