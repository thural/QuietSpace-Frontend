import React, { useState } from "react";
import styles from "./styles/postMenuStyles";
import { PiDotsThreeVertical } from "react-icons/pi";


const PostMenu = ({ handleDeletePost, setViewData, isMutable }) => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <>
            <div onClick={toggleDisplay} className={classes.menu}>
                <PiDotsThreeVertical />
            </div>

            <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></div>

            <div onClick={() => setDisplay('none')} className={classes.menuList} style={{ display }}>


                {isMutable &&
                    <div className="clickable" onClick={() => setViewData({ editPost: true })} alt={"edit icon"}>
                        <p>edit</p>
                    </div>
                }

                {isMutable &&
                    <div className="clickable" onClick={handleDeletePost} alt={"delete post icon"}>
                        <p>remove</p>
                    </div>
                }

                <div className="clickable" alt={"save post icon"}>
                    <p>save</p>
                </div>

                <div className="clickable" alt={"block post icon"}>
                    <p>block</p>
                </div>

                <div className="clickable" alt={"report post icon"}>
                    <p>report</p>
                </div>




            </div>
        </>
    )
}

export default PostMenu