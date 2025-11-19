
import express from 'express';
const router = express.Router();

router.post('/signup', (req,res)=>{
    res.json({ message:'Signup received', data:req.body });
});

export default router;
