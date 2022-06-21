import colors from 'vuetify/es5/util/colors';
export default {
  version: '1.2.3',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `vue-date-picker %s`,
    title: "vue-date-picker",
    htmlAttrs: {
      lang: 'fa',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/imgs/logo.png' }],
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/global.scss'],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/dayJalali.js',
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/dayjs'],
  dayjs: {
    locales: ['en', 'fa'],
    defaultLocale: 'fa',
    // defaultTimeZone: 'Asia/Tokyo',
    plugins: [
      'utc', // import utc from 'dayjs/plugin/utc' dayjs.extend(utc)
      'isBetween',
      "weekday"
    ]
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/styles/vuetify.scss"],
    breakpoint: {
      thresholds: {
        xs: 500,
        sm: 750,
        md: 1100,
        lg: 1500,
      },
      mobileBreakpoint: "sm",
      scrollBarWidth: 16,
    },
    treeShake: true,
    rtl: true,
    theme: {
      dark: true,
      themes: {
        light: {
          primary: colors.orange.base,
          orange: colors.orange.base,
          secondary: colors.purple.lighten1,
          success: "#009045",
          info: "#0B1B9C",
          error: colors.red.base,
          warning: colors.amber.accent3,
          backgroundColor: colors.blueGrey.lighten5,
          cardColor: colors.shades.white,
          titleColor: colors.blueGrey.darken4,
          textColor: colors.blueGrey.darken1,
        },
        dark: {
          primary: colors.orange.base,
          orange: colors.orange.base,
          secondary: colors.purple.lighten1,
          backgroundColor: "#1b1c30",
          lightBackColor: "#222339",
          darkGray: "#2D2E4F",
          gray: "#BAC0CA",
          success: "#009045",
          info: "#0B1B9C",
          error: colors.red.base,
          warning: colors.amber.accent3,
          cardColor: "#2d2e40",
          titleColor: colors.shades.white,
          textColor: colors.blueGrey.lighten2,
        },
      },
    },
  },
  loading: {
    color: '#5046bb',
    failedColor: '#f44336',
    height: '5px',
    rtl: true,
  },
  env: {
  },
  router: {},
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [],
  },
};
