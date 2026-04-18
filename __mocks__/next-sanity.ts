// Mock for next-sanity to avoid ESM issues in Jest
export const createClient = () => ({})
export const groq = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '')
