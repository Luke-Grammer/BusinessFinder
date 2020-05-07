
/*
 * Describes behavior of the 'back to top' button
 * that appears when the user scrolls the page down.
 * 
 * When the button is clicked it should scroll the page back up. 
 */
var btn = document.getElementsByClassName("scroll-btn")

window.onload = function() {
    window.onscroll = function() {
        scrollFunction()
    }
}

function scrollFunction() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) 
        btn[0].style.display = "block"
    else 
        btn[0].style.display = "none"
}

function topFunction() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}