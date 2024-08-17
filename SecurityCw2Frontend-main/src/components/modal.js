// modal.js
export const initializeModal = () => {
  // Initialize display_users
  window.display_users = document.getElementById("display_users");

  // Initialize deleteByAdmin
  window.deleteByAdmin = {
    showModal: () => {
      const modalElement = document.getElementById("deleteByAdmin");
      if (modalElement) {
        modalElement.showModal();
      }
    },
  };
};
