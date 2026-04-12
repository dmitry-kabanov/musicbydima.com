const DAYS_COOKIES_DURATION = 30;

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function loadAnalytics() {
    const isProduction = localStorage.getItem("isProduction");
    const googleAnalyticsId = localStorage.getItem("googleAnalyticsId");
    if (isProduction == "1") {
        const s = document.createElement('script');
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + googleAnalyticsId;
        s.async = true;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', googleAnalyticsId);
    }
    else {
        setCookie("google_analytics_test", "testing_on_dev", 1);
    }
}

function acceptCookies() {
    setCookie('cookie_consent', 'accepted', DAYS_COOKIES_DURATION);
    document.getElementById('cookies-consent').style.display = 'none';
    loadAnalytics();
}

function declineCookies() {
    setCookie('cookie_consent', 'declined', DAYS_COOKIES_DURATION);
    document.getElementById('cookies-consent').style.display = 'none';
}

// On page load: check consent
const consent = getCookie('cookie_consent');
if (consent === 'accepted') {
    loadAnalytics();
} else if (consent !== 'declined') {
    document.getElementById('cookies-decline-btn').addEventListener("click", declineCookies);
    document.getElementById('cookies-accept-btn').addEventListener("click", acceptCookies);
    document.getElementById('cookies-consent').style.display = 'block';
}
