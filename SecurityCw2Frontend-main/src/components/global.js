// globals.js
export var Admin;

export const setAdmin = (email) => {
  if (email === "admin@gmail.com") {
    Admin = true;
  } else {
    Admin = false;
  }
};

export const isAdmin = () => {
  return Admin;
};
