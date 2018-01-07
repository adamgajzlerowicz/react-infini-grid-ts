const isMobile = (): boolean => {
  try {
    document.createEvent('TouchEvent');
    return true;  
  } catch (error) {
    return false; 
  }
};

export {
    isMobile,
};
