/*
	Social Contents Locker
	Copyright (c) 2013 Idea R S.n.c. / www.idea-r.it
	Released under MIT License
*/

var IdeaR;
if (!IdeaR) IdeaR = {};

IdeaR.ContentsLocker = {};

// Operations

IdeaR.ContentsLocker.lockContents = function ()
{
    $(function ()
    {
        if (IdeaR.ContentsLocker.socialActivity() == true)
        {
            $('div.irBodyLocker').hide();
            $('div.irLockedBody').show();
        }
        // Add social handlers only if contents are locked
        else
            $(function ()
            {
                // Facebook
                var exsistingFbAsyncInit = window.fbAsyncInit;
                if (exsistingFbAsyncInit == null)
                    window.fbAsyncInit = IdeaR.ContentsLocker._subscribeFacebookLike();
                else
                    window.fbAsyncInit = function ()
                    {
                        exsistingFbAsyncInit();
                        IdeaR.ContentsLocker._subscribeFacebookLike();
                    };

                // Twitter
                twttr.ready(function (twttr)
                {
                    twttr.events.bind('tweet', IdeaR.ContentsLocker.ontwitteraction);
                    twttr.events.bind('follow', IdeaR.ContentsLocker.ontwitteraction);
                });
            });
    });
};

IdeaR.ContentsLocker.unlockContents = function ()
{
    $('div.irBodyLocker').slideUp(400, function ()
    {
        $('div.irLockedBody').fadeIn();
    });
    IdeaR.ContentsLocker.saveSocialAction();
};

IdeaR.ContentsLocker.saveSocialAction = function ()
{
    IdeaR.ContentsLocker._setCookie(IdeaR.ContentsLocker._socialAction, true, 10000);
};

IdeaR.ContentsLocker.socialActivity = function ()
{
    return IdeaR.ContentsLocker._getCookie(IdeaR.ContentsLocker._socialAction, 'false') == 'true' ? true : false;
};

// Implementation

IdeaR.ContentsLocker._subscribeFacebookLike = function ()
{
    FB.Event.subscribe('edge.create', function (targetUrl)
    {
        IdeaR.ContentsLocker.unlockContents();
    });
};

IdeaR.ContentsLocker._setCookie = function (name, value, expirationDays)
{
    var cookieString = escape(name) + '=' + escape(value);
    if (expirationDays != null)
    {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);
        cookieString += '; expires=' + expirationDate.toUTCString();
    }
    document.cookie = cookieString;
};

IdeaR.ContentsLocker._getCookie = function (name, defaultValue)
{
    var docCookies = document.cookie.split(";");
    for (var i = 0; i < docCookies.length; i++)
    {
        var equalPos = docCookies[i].indexOf('=');
        var currentName = unescape(docCookies[i].substr(0, equalPos));
        currentName = currentName.replace(/^\s+|\s+$/g, '');
        if (currentName == name)
        {
            var value = docCookies[i].substr(equalPos + 1);
            return unescape(value);
        }
    }
    return defaultValue;
};

IdeaR.ContentsLocker._socialAction = 'SocialAction';

// Event Handlers

IdeaR.ContentsLocker.ontwitteraction = function (intent_event)
{
    if (intent_event)
        IdeaR.ContentsLocker.unlockContents();
};

// NOTE: the Google Plus callback function must be in the global namespace
function IdeaR_ContentsLocker_ongoogleplusaction(data)
{
    if(data.state == 'on')
        IdeaR.ContentsLocker.unlockContents();
}

IdeaR.ContentsLocker.onlinkedinshare = function (data)
{
    IdeaR.ContentsLocker.unlockContents();
};

// Lock contents
IdeaR.ContentsLocker.lockContents();


