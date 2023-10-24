const modalToggle = (selector) => {
  const modalStyle = document.querySelector(selector).style;
  modalStyle.display = modalStyle.display === "none" ? "block" : "none";
};

export default modalToggle;
