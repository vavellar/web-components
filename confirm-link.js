class ConfirmLink extends HTMLAnchorElement {
    connectedCallback() {
        this.addEventListener('click', event => {
            if (!confirm('Do you really want to leave?')) {
                event.preventDefault()
            }
        })
    }
}

// this third parameter to define function is necessary if we are extending some existent html built-in element,
// not the generic HTMLElement

customElements.define('demo-confirm-link', ConfirmLink, { extends: 'a'})