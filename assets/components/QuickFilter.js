const QuickFilter = (data) => {
  return `
    <div class="quick-filter" data-category-id=${data.id}>
      <i class="${data.icon}-outline  quick-filter__icon"></i>
      <p class="quick-filter__name text-neutral-500">${data.name}</p>
    </div>
  `;
};

export default QuickFilter;
