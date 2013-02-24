var viewPort =(function(){
	var utility={};
	utility.is_iPhone = (function (includeiPod) {
	    if (typeof(includeiPod) == 'undefined')
		    return /iPhone/i.test(navigator.userAgent);
		return /iP(od|hone)/i.test(navigator.userAgent);
   })(true);
   utility.is_iPad = (function () {
	    return /iPad/i.test(navigator.userAgent);
   })();
   utility.is_iOSinApp = (function () {

        return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

    })();
    utility.is_android = (function (version) {
        var nav = navigator.userAgent;
        if (/Silk\/\d/.test(nav)) {
            nav = 'Amazon Kindle Android 2.3';
        }

        if (typeof(version) == 'undefined')
            return /Android[ \/]\d/.test(nav);

        return (new RegExp('Android[ \/]' + version.toString().replace(/\./g, '\\.'))).test(nav);
    })();
    utility.is_optimized_site =(function(){
    	var i,metatags,len;
    	metatags = document.getElementsByTagName("meta");
    	len = metatags.length;
    	for(i=0; i < len; i++){
    		if(metatags[i].name==="viewport".toLowerCase()){
    			return true;
    		}
    	}
    	return false;
    })();
    utility.dimension = {
		"inapp":{},
		"web":{
			"optimized":{
				"iPad": {
		    		"width": {
		    			'l': 1024,
		    			'p': 768
		    		},
		    		"height": {
		    			'l': 672,
		    			'p': 928
		    		}
	    		},
	    	 "galaxys3": {
		    		"width": {
		    			'l': 640,
		    			'p': 360
		    		},
		    		"height": {
		    			'l': 287,
		    			'p': 567
		    		}
	    		}
			},
			"unoptimized":{
				"iPad": {
		    		"width": {
		    			'l': 980,
		    			'p': 980
		    		},
		    		"height": {
		    			'l': 644,
		    			'p': 1185
		    		}
	    		},
	    	   "galaxys3": {
		    		"width": {
		    			'l': 980,
		    			'p': 980
		    		},
		    		"height": {
		    			'l': 439,
		    			'p': 1543
		    		}
	    		}
			}
		}
		};
		utility.env = utility.is_iOSinApp ? "inapp" : "web";
		utility.site = utility.is_optimized_site ? "optimized" :"unoptimized";
		/*if(utility.is_android){
			utility.device ="galaxys3"; // samsung galaxy tab and samsung tab has same user agent string. so for time being hard coded
		}*/
		if (utility.is_iPad) {
    		utility.device="iPad";
		} else if (utility.is_iPhone) {
			if (screen.availHeight > 500){
    			utility.device="iPhone5";
			} else {
    			utility.device="iPhone";
			}
		}else if(utility.is_android){
			utility.device ="galaxys3"; // samsung galaxy tab and samsung tab has same user agent string. so for time being hard coded
		} else {
			utility.device="desktop";
		};
		utility.getOrientation = function(){
			return Math.abs((window.orientation) == 90) ? 'l' : 'p';
		}
		utility.getZoomLevel = function(){
			return 1;
			var o = this.getOrientation();
			return window.innerWidth/this.dimension[this.env][this.site][this.device].width[o];
		}
		utility.getScaleFactor=function(){
			var o, oRatios;
			o = this.getOrientation();
			oRatios = {
			    width: window.innerWidth / utility.LayoutDim.width,
				height: window.innerHeight / utility.LayoutDim.height
			}
			var scale = Math.round(Math.min(oRatios.width, oRatios.height)*1000)/1000;
			return scale;
		}
		utility.getViewPortMargin = function(scale, zoom){
			var o = (Math.abs(window.orientation) == 90) ? 'l' : 'p';
			var final,scaledwidth, scaledHeight, merginTop, marginLeft;
			final = scale*zoom;
			scaledwidth = Math.round(utility.LayoutDim.width*final);
			scaledHeight = Math.round(utility.LayoutDim.height*final);
			marginTop = (window.innerHeight - scaledHeight)/2;
			marginLeft = (window.innerWidth - scaledwidth)/2;
			return {'marginTop':marginTop,'marginLeft':marginLeft}
			
		}
		utility.$=function (selector) {
			var doc = window.document;					
			if (selector[0] === '.') {
				return doc.getElementsByClassName(selector.substr(1));
			} else if (selector[0] === '#') {
				return doc.getElementById(selector.substr(1));
			} else {
				return doc.getElementsByTagName(selector);
			}
		}	
		utility.getParentOffset = function(){
			var x = window.pageXOffset;
			var y = window.pageYOffset;
			return {'x':x, 'y':y};
		}
		utility.setStyle = function(element, key, value){
			var key = key.toLower();
			switch(key){
				case width:
				case height:
				element.style[key] = value+"px";
				break;
				default:
				element.style[key]=value;
			}
		}
		var viewPort={};
		viewPort.setLayoutConfig=function(cfg){
			utility.LayoutDim={};
			utility.Layout={};
			utility.LayoutDim.width = cfg.width;
			utility.LayoutDim.height = cfg.height;
			utility.Layout.ParentNodeId = cfg.parentId;
			utility.Layout.ChildNodeId = cfg.childId;
			utility.Layout.parentNode=utility.$(cfg.parentId);
			utility.Layout.childNode=utility.$(cfg.childId);
		};
		viewPort.currentState = function(){
			this.zoom= utility.getZoomLevel();
			this.scale = utility.getScaleFactor();
			this.margin = utility.getViewPortMargin(this.scale, this.zoom);
			this.parentOffset = utility.getParentOffset();
		}
		viewPort.render = function(){
			this.currentState();
			var child = utility.Layout.childNode; 
			var parent = utility.Layout.parentNode;
			child.style.webkitTransformOrigin = "0% 0%";
            child.style.webkitTransform = "scale(" + this.zoom*this.scale + ")";
            child.style.marginLeft = Math.round(this.margin.marginLeft)+"px"; 
            child.style.marginTop  =  Math.round(this.margin.marginTop)+"px";
            parent.style.position ="absolute";
            parent.style.width = window.innerWidth+"px";
            parent.style.height = window.innerHeight+"px";
            var that = this;
            window.setTimeout(function(){
            	that.currentState();
            	parent.style.left = that.parentOffset.x + "px";
            	parent.style.top = that.parentOffset.y + 'px';
            	}, 10
            );
			
		}
		return viewPort;
;})();
/*var layoutCfg = {"width":300,"height":300,"parentId":"#parent","childId":"#child"};
viewPort.setLayoutConfig(layoutCfg);
window.addEventListener('load', viewPort.render.call(viewPort));
*/

