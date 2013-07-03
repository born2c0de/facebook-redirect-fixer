// ==UserScript==
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

var fixRedirect = function(event)
{
	var node = event.target;		
	// Get attribute containing the real url.	
	var mouseOverAttr = node.getAttribute('onmouseover');
	// disable facebook's evil url swapping function
	node.removeAttribute('onclick');
	node.removeAttribute('onmouseover');
	// disable this event handler
	node.removeEventListener('mouseenter',fixRedirect,false);
	
	// Extract real url from facebook's sneaky mouseover event handler.
	var refPattern = /LinkshimAsyncLink.swap\(this\, \"(.*)\"\);/;
	var realHref = unescape(refPattern.exec(mouseOverAttr)[1]);
	realHref = realHref.replace(/\\\//g,"/");
	// set the href tag to the original URL as it should be.
	node.href = realHref;
};

function huntForLinks()
{
	var items = document.getElementsByTagName('a');	
	var mouseOverAttr;
	var onClickAttr;
	var evilFunc = 'LinkshimAsyncLink.swap(this';
	for (var i = items.length - 1; i >= 0; i--)
	{
		mouseOverAttr = items[i].getAttribute('onmouseover');
		onClickAttr = items[i].getAttribute('onclick');
		
		if(mouseOverAttr && onClickAttr)
		{
			if(mouseOverAttr.indexOf(evilFunc) !== -1 &&
				onClickAttr.indexOf(evilFunc) !== -1)
			{
				items[i].addEventListener('mouseenter',fixRedirect,false);				
			}
		}
	};
}
