import { createUseStyles } from "react-jss"

const styles = createUseStyles({

    wrapper: {
        fontSize: '.9rem',
        margin: '.8rem 0 1.2rem 0',
        gap: '.5rem',
        '& .right-section': {
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
            backgroundColor: '#3c3c3c'
        },
        '& .reply-card-text': {
            width: '100%',
            fontSize: '.9rem',
            height: '2rem',
            borderRadius: '0 .5rem .5rem .0',
            backgroundColor: '#dbe2e8',
            padding: '0 0.5rem'
        }

    },

    comment: {
        maxWidth: '50%',
        width: 'fit-content',
        position: 'relative',


        '& .comment-text': {
            display: 'inline-block',
            margin: '0',
            padding: '0'
        },
        '& .comment-options > *': {
            cursor: 'pointer',
        },
    },

    commentBody: {
        backgroundColor: '#F0F2F4',
        boxSizing: 'border-box',
        borderRadius: '1rem 0rem 1rem 0rem',
        padding: '10px 10px',
    },

    avatar: {
        color: 'black',
        borderRadius: '10rem',
        alignSelf: 'flex-'
    },

    commentOptions: {
        margin: '.5rem 0',
        width: '100%',
        gap: '10px',
        color: '#303030',
        display: 'flex',
        flexFlow: 'row nowrap',
        fontSize: '.8rem',
        fontWeight: '500',
        '& > *': {
            cursor: 'pointer',
        },
        '& p': {
            margin: '0',
            fontSize: '.8rem',
            color: '#4d4d4d'
        }
    },

})


export default styles