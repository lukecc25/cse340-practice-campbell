import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('test', { title: 'Test' });
})

router.post('/', (req, res) =>{
    const { name, email } = req.body;
    console.log(`Name: ${name}\nEmail: ${email}`);
    res.redirect('/test')
})
export default router;