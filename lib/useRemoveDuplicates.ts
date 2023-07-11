export const useRemoveDuplicates = (listOfObjects: any[]) => {
  const uniqueObjects: any[] = listOfObjects.reduce(
    (accumulator: any[], current) => {
      if (!accumulator.find((item: any) => item._id === current._id)) {
        accumulator.push(current);
      }
      return accumulator;
    },
    []
  );

  return uniqueObjects;
};
