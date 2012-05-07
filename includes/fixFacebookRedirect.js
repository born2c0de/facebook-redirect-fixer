// ==UserScript==
// @name           Remove Google Redirect
// @include        https://www.facebook.com/*
// @include        https://facebook.com/*
// @include        http://www.facebook.com/*
// @include        http://facebook.com/*
// @run-at         document-start
// ==/UserScript==

//UserJS based on script from http://userscripts.org/scripts/review/117942

document.addEventListener('DOMNodeInserted',checksearch,false);
function checksearch()
{	
	if(window.location.hostname.match(/www\.facebook\.com/))
	{
		document.removeEventListener('DOMNodeInserted',checksearch,false);
		document.addEventListener('DOMNodeInserted',huntForLinks,false);
	}
}
function fixRedirect(node)
{
	node.removeAttribute('onmousedown');		
	var fbRedirectURL = "http://www.facebook.com/l.php?u=";
	var refString = /&h=(.+)$/;
	var realHref=node.href.replace(fbRedirectURL,"");	
	if(realHref && realHref != node.href)
	{	
		realHref= realHref.replace(refString,"");			
		node.href=unescape(realHref);		
	}	
}

function huntForLinks()
{
	function fixLink(event)
	{
		var node=event.target;
		if(!node || event.attrName != 'href')return;		
		fixRedirect(node);
	}
	var items=document.getElementsByTagName('a');
	for(var i=0;i<items.length;i++)
	{
		items[i].addEventListener('DOMAttrModified',fixLink,false);
	}
}