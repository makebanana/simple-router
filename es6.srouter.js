class Srouter{
	constructor({dom_box,router}) {
		if(!dom_box){
			if(console){
				console.warn('forget add a dom for show pageHTML');
			}else{
				alert('forget add a dom for show pageHTML');
			}
			return;
		}
		this._undefind_index = 0;
		this._router  = this.packageRouters(router);
		this._current = {
			index: '',
			path: '',
			parms: {},
		};
		this._callback = this.updateDomFn(dom_box);
		this.init();
	}

	packageRouters(routerArr) {

		return routerArr.map((router,i) => { return this.packageRouter(router,i);});

	}

	packageRouter(router,index){

		let _query  = {};
		let _index;

		if(router.noFind){

			this._undefind_index = index;

		}

		router.realPath = router.path.replace(/\{(\w+)\}/g,(match,key,index,str) => {

				_index = 0;

				str.split(match)[0].replace(/\//g,() => {
					_index = _index + 1;
				});

				_query[_index] = key;

	            return '{ANYKEY}';
	        });
		
		if(_index !== undefined){ router.query = _query;}

		return router;

	}

	matchHash(hash) {

		let _arrHashParms,
		 	_parms = {};

		let _realPath = hash,  
			_loopPath,
			_queryObj;

		let _returnObj = {

			index: this._undefind_index,
			path:  this._router[this._undefind_index].path,
			parms: {},
		};

		if(hash.indexOf('?') > -1){

			_realPath = hash.substr(0,hash.indexOf('?'));

			_arrHashParms = hash.split('?')[1].split('&');

			_arrHashParms.forEach((str) => {

				_parms[str.split('=')[0]] = str.split('=')[1];

			});

		}

		//排除了没有找到以及第一个/
		this._router.some((router,index) => {

			_loopPath = _realPath;

			if(router.realPath.split('/').length === _loopPath.split('/').length){		

				_queryObj = {};

				if(router.query !== undefined){

					_loopPath =_loopPath.split('/');

					for (let key of Object.keys(router.query)) {

					 	_queryObj[router.query[key]] = _loopPath[key];

						_loopPath[key] = '{ANYKEY}';

					}

					_loopPath = _loopPath.join('/');

				}

				if(router.realPath === _loopPath){

					_returnObj.index = index;

					_returnObj.path  = router.path;

					_returnObj.parms  = Object.assign({},_parms,_queryObj);

					return true;
				}

			}
		});

		return _returnObj;

	}

	updateDomFn(dom) {  

	     return (domHTML) => {

	     	dom.innerHTML = domHTML;

	     };

	}

	hashRun(hash) {

			let _nextHash = location.hash.substr(1);

			if(_nextHash === this._current.path || _nextHash.indexOf('/') === -1 ){return;}

			let _next   = this.matchHash(_nextHash);

			if(this._current.index !== ''){

			    if(typeof this._router[this._current.index].leave === 'function'){

			    	this._router[this._current.index].leave();
			    }

			}

	    	this._router[_next.index].enter(this._callback,_next.parms,this._router[_next.index]);

	    	this._current = _next;


	}

	init() {

		this.hashRun();
		
		window.addEventListener("hashchange",this.hashRun.bind(this));
	}

}
export Srouter;