class Modal extends HTMLElement {
    constructor() {
        super();
        this._modalElement;
        this._backdrop
        this.attachShadow({ mode: 'open'})
        this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }
                
                /*when the button trigger by outside add open attribute to my custom element, 
                then these properties will be applied to backdrop and modal styles, this is useful 
                when i need to change just css
                */
                :host([open]) #backdrop, 
                :host([open]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }
                
                :host([open]) #modal {
                    top: 15vh;
                }
                
                #modal {
                    position: fixed;
                    top: 10vh;
                    left: 25%;
                    width: 50%;
                    z-index: 100;
                    background: white;
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s ease-in-out;
                }
                
                #footer {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }
                
                #main {
                    padding: 1rem;
                }
                
                header {
                 padding: 1rem;
                border-bottom: 1px solid #ccc;
                }
                
                header h1 {
                    font-size: 1.25rem;
                }
                
                #footer button {
                    margin: .5rem;
                }
            </style>
            <div id="backdrop"></div>
            <div id="modal">
                <header>
                    <slot name="title">
                        <h1>Default modal title</h1>
                    </slot>
                </header>
                <section id="main">
                    <slot name="content"></slot>
                </section>
                <section id="footer">
                    <button id="cancel">Cancel</button>
                    <button id="confirm">Confirm</button>
                </section>
            </div>
        `

        const slots = this.shadowRoot.querySelectorAll('slot')
        slots[1].addEventListener('slotchange', event => {
            console.dir(slots[1].assignedNodes())
        })
    }

    connectedCallback() {
        const cancelButton = this.shadowRoot.getElementById('cancel')
        const confirmButton = this.shadowRoot.getElementById('confirm')
        // this._modalElement = this.shadowRoot.querySelector('#modal')
        this._backdrop = this.shadowRoot.getElementById('backdrop')
        this._backdrop.addEventListener('click', this._cancel.bind(this))
        cancelButton.addEventListener('click', this._cancel.bind(this))
        confirmButton.addEventListener('click', this._confirm.bind(this))
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (name === 'open') {
    //         this._backdrop.classList.add('backdrop')
    //         this._modalElement.style.display = 'flex'
    //     }
    // }
    //
    // static get observedAttributes() {
    //     return ['open']
    // }

    _close() {
       if(this.hasAttribute('open') ) {
            this.removeAttribute('open')
        }
    }

    _cancel(event) {
        this._close()
        // bubbles allows the event goes up, and composed enable the event leaves the shadow dom to real dom
        // (can be listened by outside our component
        const cancelEvent = new Event('cancelClicked', { bubbles: true, composed: true})
        event.target.dispatchEvent(cancelEvent)
    }

    _confirm() {
        this._close()
        this.dispatchEvent(new Event('confirmClicked'))
    }

    open() {
        this.setAttribute('open', '')
    }

}

customElements.define('demo-modal', Modal)