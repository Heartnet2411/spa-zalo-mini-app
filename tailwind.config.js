module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  },
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Work Sans', 'sans-serif'],
        // Thêm các font khác nếu cần
      },
    },
  },
};
