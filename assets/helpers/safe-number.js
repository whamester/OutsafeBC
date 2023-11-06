const safeNumber = (value, fallback = 0) => {
  try {
    if (Number.isNaN(Number(value))) {
      return fallback;
    }
    return Number(value);
  } catch (error) {
    console.error(error);
  }

  return fallback;
};

export default safeNumber;
