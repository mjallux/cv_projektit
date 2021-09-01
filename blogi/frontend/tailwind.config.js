module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'aurora': "url('./src/assets/aurora.jpg');background-size:100%;background-repeat:no-repeat;",
      }),
      minHeight: {
        '50': '50vh',
      },
      maxWidth: {
        '20': '20vw'
      },
      minWidth: {
        '1/3': '33vw'
      },
      fontSize: {
        '2xs': '.5rem'
      },
      borderWidth: {
        '1': '1px'
      },
      margin: {
        '10p' : '10%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms')
  ],
}