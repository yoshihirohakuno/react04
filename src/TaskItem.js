import React from "react";
import { storage, db } from "./firebase";
import ClearIcon from "@material-ui/icons/Clear";


const TaskItem = ({ id, title }) => {
    const DeleteInputData = () => {
        db.collection("group").doc(id).delete();
    };
    return(
        <div key={id}>
            <h1>{title}</h1>
            <button onClick={DeleteInputData}>
                <ClearIcon/>
            </button>    
        </div>    
    );
};

export default TaskItem;