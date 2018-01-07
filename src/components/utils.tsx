const isMobile = (): boolean => {
  try {
    return false;  
  } catch (error) {
    return true; 
  }
};

export {
    isMobile,
};
