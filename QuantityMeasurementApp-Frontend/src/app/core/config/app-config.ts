export type AppConfig = {
  apiBaseUrl: string;
  googleOAuthStartUrl: string;
  appName: string;
};

export const APP_CONFIG: AppConfig = {
  apiBaseUrl:'https://quantitymeasurementapp-production-c4e6.up.railway.app',
    googleOAuthStartUrl:'https://quantitymeasurementapp-production-c4e6.up.railway.app/oauth2/authorization/google',
  appName: 'Quantity Measurement'
};

