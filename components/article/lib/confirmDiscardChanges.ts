export const confirmDiscardChanges = (isDirty: boolean): boolean => {
  if (!isDirty) {
    return true;
  }

  return window.confirm(
    "Du har osparade ändringar. Vill du lämna redigeringsläget utan att spara?",
  );
};
