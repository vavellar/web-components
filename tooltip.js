class Tooltip extends HTMLElement {
    constructor() {
        super()
        this._tooltipIcon
        this._tooltipVisible = false
        this._tooltipText = 'Some dummy tooltip text.'
        // enable the shadow dom three for this element
        this.attachShadow({ mode: 'open'})
        this.shadowRoot.innerHTML = `
            <style> 
                div {
                    font-weight: normal;
                    background-color: black;
                    color: white;
                    position: absolute;
                    top: 1.5rem;
                    left: 0.75rem;
                    z-index: 10;
                    padding: 0.15rem;
                    border-radius: 3px;
                    box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
                }
                
                :host {
                    position: relative;
                }
                /*this will add this style only if our component has the important class set*/
                :host(.important) {
                    background: var(--color-primary, #ccc);
                    padding: 0.15rem;
                }
                
                /*this pseudo selector will apply this call only if our component is wrapped by the element passed by argument*/
                :host-context(p) {
                   font-weight: bold;
                }
                
                ::slotted(.highlight) {
                    border-bottom: 1px dotted red;
                }
                
                .icon {
                    background-color: black;
                    color: white;
                    padding: 0.15rem 0.5rem;
                    text-align: center;
                    border-radius: 50%;
                }
            </style>
            <slot>Default slot</slot>
            <span class="icon"> (?)</span>
        `

    }

    // its not possible insert dom elements in constructor, because at that moment the dom is not available to do that,
    // connectedCallback is a lifecycle method where the real dom is mounted
    // is invoked each time the custom element is appended into a document-connected element
    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text')
        }
        this._tooltipIcon = this.shadowRoot.querySelector('span')
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))
        this._render()
    }

    //  is invoked when one of the custom element's attributes is added, removed, or changed.
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return
        }

        if (name === 'text') {
            this._tooltipText = newValue
        }
    }

    static get observedAttributes() {
        return ['text', 'class']
    }

    // executed when element is removed from the dom
    disconnectedCallback() {
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip)
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip)
    }

    _render() {
        let tooltipContainer = this.shadowRoot.querySelector('div')
        if(this._tooltipVisible) {
            tooltipContainer = document.createElement('div')
            tooltipContainer.textContent = this._tooltipText
            this.shadowRoot.appendChild(tooltipContainer)
        } else {
            if (tooltipContainer) {
                this.shadowRoot.removeChild(tooltipContainer)
            }
        }
    }

    _showTooltip() {
        this._tooltipVisible = true
        this._render()
    }

    _hideTooltip() {
        this._tooltipVisible = false
        this._render()
    }
}

customElements.define('demo-tooltip', Tooltip)