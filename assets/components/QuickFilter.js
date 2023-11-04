class QuickFilter {
  constructor(data) {
    this.data = data;
  }

  getHTML = () => {
    return `
      <div id="quick-filter-${this.data.id}" class="pointer" onclick=" if(this.classList.contains('selected')){ this.classList.remove('selected'); return; } this.classList.add('selected');">
          <i class="${this.data.icon}  quick-filter__icon"></i>
          <p class="quick-filter__name">${this.data.name}</p>
      </div>
    `;
  };
}

export default QuickFilter;
