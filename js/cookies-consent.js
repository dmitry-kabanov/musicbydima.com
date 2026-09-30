const DAYS_COOKIES_DURATION = 30;

function loadAnalytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    const isProduction = localStorage.getItem("isProduction");
    const googleAnalyticsId = localStorage.getItem("googleAnalyticsId");
    if (isProduction == "1") {
        gtag("consent", "default", {
            "analytics_storage": "denied",
            "ad_storage": "denied",
            "ad_user_data": "denied",
            "ad_personalization": "denied",
        });

        const consent = getCookie('cookie_consent');
        if (consent === 'accepted') {
            updateConsent("granted");
        }

        const s = document.createElement('script');
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + googleAnalyticsId;
        s.async = true;
        document.head.appendChild(s);

        gtag('js', new Date());
        gtag('config', googleAnalyticsId);
    }
    else {
        setCookie("google_analytics_test", "testing_on_dev", 1);
    }
}

function onCookiesAccepted() {
    updateConsent("granted");
    setCookie('cookie_consent', 'accepted', DAYS_COOKIES_DURATION);
    document.getElementById('cookies-consent-banner').style.display = 'none';
}

function onCookiesRejected() {
    updateConsent("denied");
    setCookie('cookie_consent', 'rejected', DAYS_COOKIES_DURATION);
    document.getElementById('cookies-consent-banner').style.display = 'none';
}

function updateConsent(status) {
    gtag("consent", "update", {
        "ad_user_data": status,
        "ad_personalization": status,
        "ad_storage": status,
        "analytics_storage": status
    });
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// On page load: check consent
loadAnalytics();

document.addEventListener("DOMContentLoaded", () => {
    const consentCookieValue = getCookie("cookie_consent");
    const banner = document.getElementById("cookies-consent-banner");
    const rejectButton = document.getElementById('cookies-reject-btn');
    const acceptButton = document.getElementById('cookies-accept-btn');

    if (consentCookieValue != "accepted" && consentCookieValue != "rejected" && banner) {
        rejectButton.addEventListener("click", onCookiesRejected);
        acceptButton.addEventListener("click", onCookiesAccepted);
        banner.style.display = 'block';
    }
});

