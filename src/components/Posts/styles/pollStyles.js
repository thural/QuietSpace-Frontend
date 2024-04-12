import { createUseStyles } from "react-jss"

const styles = createUseStyles({
  pollContainer: {
    gap: '.5rem',
    display: 'flex',
    flexFlow: 'column nowrap',
    margin: '1rem 0',
  },

  progressContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '1rem',
    alignItems: 'center'
  },

  progress: {
    height: '2.75rem',
    width: '100%',
    borderRadius: 'inherit',
    backgroundColor: 'white',
    boxShadow: '0px 0px 0px 1px #dee2e6 inset'
  },

  progressBox: {
    width: '100%',
    borderRadius: '1rem',
  },

  optionDesc: {
    position: 'absolute',
    left: '1rem',
    fontSize: '.9rem',
    fontWeight: '500',
    color: 'white',
    mixBlendMode: 'difference',
    zIndex: '1'
  },

  optionPerc: {
    position: 'absolute',
    right: '1rem',
    fontSize: '.9rem',
    fontWeight: '500',
    color: 'white',
    mixBlendMode: 'difference',
    zIndex: '1'
  },

});


export default styles
