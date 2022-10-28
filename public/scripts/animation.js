export function animateLeftSlider(el) {
    let element = $(el)
    if (element.hasClass('open-nav')) {
        element.removeClass('open-nav')
        element.addClass('close-nav')
    } else {
        element.removeClass('close-nav')
        element.addClass('open-nav')
    }
}

export function toggleClass(el,c) {
    let element = $(el)
    if (element.hasClass(c)) {
        element.removeClass(c)
    } else {
        element.addClass(c)
    }
}

