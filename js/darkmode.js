// based on https://github.com/codemzy/static-blog/blob/main/js/darkmode.js

const DARK = "dark", LIGHT = "light";

function setDarkMode(dark, preference) {
    const newTheme = dark ? DARK : "light";
    // only set theme if it contradicts browser preference
    if (preference === newTheme) {
        localStorage.removeItem('theme');
    } else {
        localStorage.setItem('theme', preference);
    }
    document.querySelector('html').dataset.theme = newTheme;
};

// check if we need to add dark class from theme or OS preference
const preference = window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
if (localStorage.getItem('theme') === DARK || (!('theme' in localStorage) && preference === DARK)) {
    setDarkMode(true, preference);
} else if (localStorage.getItem('theme') === LIGHT || (!('theme' in localStorage) && preference === LIGHT)) {
    setDarkMode(false, preference);
}

function toggleDarkMode() {
    setDarkMode(document.querySelector('html').dataset.theme !== DARK, preference);
}
