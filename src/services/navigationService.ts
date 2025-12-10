// navigationService.ts
let navigator = null;

export const setNavigator = (navRef) => {
  navigator = navRef;
};

export const navigate = (...args) => {
  if (navigator) {
    navigator.navigate(...args);
  }
};
