class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <style></style>
          <header>
            <nav>
              <ul>
                <li><a href="/page1">Page 1</a></li>
                <li><a href="/page2">Page 2</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </nav>
          </header>
        `;
  }
}

customElements.define("header-component", Header);
