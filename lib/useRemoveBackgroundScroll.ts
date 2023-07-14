export const useRemoveBackgroundScroll = (open: boolean) => {
  if (open) {
    // Disables Background Scrolling whilst the Modal is open
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  } else {
    // Unsets Background Scrolling to use when Modal is closed
    document.body.style.overflow = "unset";
  }
};
