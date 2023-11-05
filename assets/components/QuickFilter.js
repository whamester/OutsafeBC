const QuickFilter = (data) => {
  return `
    <div class="quick-filter" data-category-id=${data.id}>
      <i class="${data.icon}  quick-filter__icon"></i>
      <p class="quick-filter__name">${data.name}</p>
    </div>
  `;
}

export default QuickFilter;
