import React, {useState} from 'react'
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from '@mui/material/Modal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';
import route from "../../utils/server_router";


const DeleteTweet = ({tweet_id}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () =>{
        setOpen(false)
        setStage(1);
    };
    const [stage, setStage] = useState(1);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius : `${stage === 2 ? "25px" : "1px"}`,
        boxShadow: 24,
        p: 0,
      };

      const deleteTweet = () =>{
        console.log(`Tweet id : ${tweet_id}`);
        axios.delete(route + "/api/delete/tweet",{
            tweet_id
        })
        .then(()=> handleClose())
        .catch((e)=>console.error(e))
      } 
    

  return (
    <div>
      <MoreHorizIcon 
        className="tweet3Dots"
        onClick={() => {handleOpen()}}/>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            {stage === 1 && <div className='tweetDeleteOption'>
                <div className="deleteTweetRow deleteTweetFirst" onClick={()=> setStage(2)}> 
                    <DeleteOutlineIcon/>
                    Delete
                </div>
                <div className="deleteTweetRow" onClick={handleClose}>
                    <CancelIcon/>
                    Cancel
                </div>
            </div>}

            {stage == 2 && <div className='tweetDeleteOption'>
                <div className='deleteTweetPadding'>
                    <div className='deleteTweetHeader'>Delete Tweet?</div>
                    <div className='deleteTweetBody'>
                    This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results.
                    </div>
                    <div className='deleteTweetButtonsDiv'>
                        <button 
                        className='deleteTweetFinalButton deleteTweetButtons'
                        id='deleteTweetButtonFinal'
                        onClick={deleteTweet}
                        >Delete</button>
                        
                        <button 
                        className='deleteTweetSecondCancelButton deleteTweetButtons'
                        id='deleteTweetCancelButtonFinal'
                        onClick={handleClose}
                        >Cancel</button>
                    </div>
                </div>
            </div>}
        </Box>
      </Modal>
    </div>
  )
}

export default DeleteTweet