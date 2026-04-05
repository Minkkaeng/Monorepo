export interface AppConfig {
  apiUrl: string;
  appName: string;
  environment?: string;
  version?: string;
}

/**
 * 앱 전역 환경 변수를 주입받아 설정 객체를 생성하는 팩토리 함수입니다.
 * 프레임워크 패키지는 런타임 환경(Next, Vite 등)을 모르므로 앱에서 직접 값을 주입해야 합니다.
 */
export const createConfig = (env: AppConfig) => {
  return {
    apiUrl: env.apiUrl,
    appName: env.appName,
    environment: env.environment || "development",
    version: env.version || "1.0.0",
  };
};
