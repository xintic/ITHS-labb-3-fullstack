export const getTransformedImageUrl = (originalUrl: string, transformation: string): string => {
  return originalUrl.replace('/upload/', `/upload/${transformation}/`);
};
