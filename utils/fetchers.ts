export const defaultFetcher = async (
  ...args: [string, RequestInit?]
): Promise<unknown> => {
  const response = await fetch(...args)
  return response.json()
}
