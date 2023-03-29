class MagicButton extends HTMLElement {
    constructor() {
        super()
        this._contentIsVisible = false
        this.attachShadow({ mode: 'open'})
        this.shadowRoot.innerHTML = `
            <style> 
                #info-box {
                    display: none;
                }
                
                div {
                    display: flex;
                    flex-direction: column-reverse;
                    width: fit-content;
                }
            </style>
            <div>
                <slot id="info-box">Default slot</slot>
            </div>         
        `
    }

    connectedCallback() {
        const button = document.createElement('button')
        button.textContent = 'Default button text'
        this.shadowRoot.querySelector('div').appendChild(button)
        if (this.hasAttribute('text')) {
            button.textContent = this.getAttribute('text')
        }

        this.addEventListener('click', this._handleContentVisibility)
    }

    _handleContentVisibility() {
        const text = this.shadowRoot.querySelector("#info-box")
        if (this._contentIsVisible) {
            text.style.display = 'none'
            this._contentIsVisible = false
        } else {
            text.style.display = 'flex'
            this._contentIsVisible = true
        }
    }
}

customElements.define('demo-magic-button', MagicButton)