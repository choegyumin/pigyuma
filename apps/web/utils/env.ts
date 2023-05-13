export const DEV_ENV = process.env.NODE_ENV === 'development';
export const PROD_ENV = process.env.NODE_ENV === 'production';
export const TEST_ENV = process.env.NODE_ENV === 'test';

export const SERVER_ENV = typeof window === 'undefined';
export const BROWSER_ENV = !SERVER_ENV;
