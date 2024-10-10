
export const activeLink = (link: string) => {

    if(typeof window !== 'undefined') {
        console.log(window.location.pathname, link)
            return window.location.pathname.startsWith(link);
    }

    return false;
}
