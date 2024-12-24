import { createI18n } from "vue-i18n";

const messages = {
  en: {
    message: {
      welcome: "Welcome, {name}!",
      name: "TaeYeong Jeong"
    },
  },
  ko: {
    message: {
      welcome: "환영합니다, {name} 님!",
      name: "정태영",
    },
  },
};

const i18n = createI18n({
  locale: "ko", // 기본 언어
  fallbackLocale: "en", // 언어가 없을 경우 사용할 언어
  messages, // 메시지 객체
});

export default i18n;
