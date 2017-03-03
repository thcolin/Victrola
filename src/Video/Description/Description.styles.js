import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    maxHeight: '160px',
    overflowY: 'scroll',
    '@media (max-width: 810px)': {
      margin: '0 0 20px'
    },
    '@media (min-width: 810px)': {
      flex: 1
    }
  },
  text: {
    margin: 0
  }
})
