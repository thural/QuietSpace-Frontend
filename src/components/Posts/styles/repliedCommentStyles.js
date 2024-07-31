import { createUseStyles } from "react-jss"

const styles = createUseStyles({

    container: {
        fontSize: '.9rem',
        margin: '.8rem 0 1.2rem 0',
        gap: '.5rem',
        '& .right-section':{
            flexDirection: 'column',
            gap: '1.2rem'
        }
    },

    replyCard: {
        alignItems: 'center',
        '& .reply-card-indicator': {
            width: '.35rem',
            height: '2rem',
            borderRadius: '1rem 0rem 0rem 1rem',
            backgroundColor: '#ffb838'
        },
        '& .reply-card-text': {
            fontSize: '.9rem',
            height: '2rem',
            borderRadius: '0 .5rem .5rem .0',
            backgroundColor: '#dbe2e8',
            padding: '0 0.5rem'
        }

    },

    comment: {
        width: 'fit-content',
        padding: '10px 10px',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#F0F2F4',
        borderRadius: '1rem 0rem 1rem 0rem',

        '& .comment-text': {
            display: 'inline-block',
            margin: '0',
            padding: '0'
        },
        '& .comment-options > *': {
            cursor: 'pointer',
        },
    },

    avatar: {
        color: 'black',
        borderRadius: '10rem',
        alignSelf: 'flex-'
    },
})


export default styles