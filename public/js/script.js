$(function() {
    var segment = location.pathname.split("/")[2]

    if (segment !== '') {
        $('#side-nav a.nav-link[href^="' + segment + '"]').addClass('active')
    }
})
