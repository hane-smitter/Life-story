const express = require('express');
const router = express.Router();
const Story = require('../models/story');


//@desc show add page
//route GET /stories/add
router.get('/stories/add',  (req, res) => {
    res.render('stories/add');
});
//@desc save data from add page
//route POST /stories
router.post('/stories',  async(req, res) => {

    try {
        req.body.isValid = function() {
            if( (this.title.length < 1) || (this.status.length < 1) || (this.body.length < 1)) {
                return false;
            }
            return true;
        }

        console.log(req.body.isValid());
        if( !req.body.isValid() ) {
            return res.redirect('/stories/add?empty');
        }

    } catch (err) {
        console.log(err);
        console.log(req.body);
        return res.redirect('/stories/add?tryagain');
    }
    
    

    req.body.creator = req.user.id;

    try {
        let story = new Story(req.body);
        await story.save();
        res.redirect('/dashboard?added');
    } catch (err) {
        console.log(err);
        res.status(500).render('errors/500', { layout: 'error' });
    }
});

//@desc see all public stories
//route GET /stories/
router.get('/stories',  async(req, res) => {
    try {
        const stories = await Story.find( {status: 'public'} )
        .populate('creator')
        .lean();
        res.render('stories/index', { stories });
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
});

//@desc specific story in detail
//route GET /stories/:id
router.get('/stories/:id', async (req, res) => {
    const storyId = req.params.id;
    try {
        const story = await Story.findById(storyId)
        .populate("creator")
        .lean();
        res.render('stories/view_story', { story });
    } catch (err) {
        console.log(err);
        res.status(404).render('errors/404', { layout: 'error' });
    }
});

//@desc specific story in detail
//route GET /stories/user/:id
router.get('/stories/user/:id', async (req, res) => {
    try {
        const stories = await Story.find({
            creator: req.params.id,
            status: 'public'
        })
        .populate('creator')
        .lean();
        res.render('stories/index', { stories});
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
});

//@desc edit your story
//route GET /stories/edit/:id
var storyId;
router.get('/stories/edit/:id', async(req, res) => {
    storyId = req.params.id;
    try {
        const story = await Story.findById(storyId).lean();
        res.render('stories/edit', { story });

    } catch(err) {
        res.status(500).render('errors/500', { layout: 'error' });
    }
});
//@desc save edited story
//route POST /stories/edit
router.patch('/stories/edit/', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'title', 'body', 'creator'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidUpdate) return res.redirect('/stories/edit/' + storyId + '?invalid');
    
    try{
        const story = await Story.findById(storyId);
        if (story._id != req.user._id) {
            res.redirect('/dashboard?unauth');
        }

        if(!story) {
            res.status(404).render('errors/404');
        }

        updates.forEach((update) => {
            story[update] = req.body[update];
        });
        await story.save();
        res.redirect('/dashboard?updated');

    } catch(err) {
        res.status(500).render('errors/500', { layout: 'error' });
    }
});

//@desc deletion endpoint
//route DELETE /stories/:id
router.delete('/stories/:id/', async(req, res) => {
    try {
        await Story.deleteOne({_id: req.params.id});   
        res.redirect('/dashboard?deleted');
    } catch (err) {
        console.log(err);
        res.status(500).render('errors/500');
    }
});

module.exports = router;