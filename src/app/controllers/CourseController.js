const Course = require('../models/Course');
const UploadController = require('./UploadController');

const createError = require('http-errors');

class CourseController {
    // GET /courses/
    index(req, res, next) {
        Course.find({})
            .then((courses) =>
                res.render('course', { title: 'Courses', courses }),
            )
            .catch(next);
    }

    // GET /courses/:slug
    showDetail(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                if (course) {
                    res.render('course/show-detail', {
                        title: course.name,
                        course,
                    });
                } else {
                    next(createError(404));
                }
            })
            .catch(next);
    }

    // GET /courses/create
    createCourse(req, res) {
        res.render('course/create-course', { title: 'Tạo khóa học mới' });
    }

    // POST /courses/create
    async storeCourse(req, res, next) {
        const courseImage = await UploadController.saveFile(req);
        const course = new Course(req.body);
        if (courseImage.status) {
            course.image = courseImage.data.sharePath;
        }

        try {
            const saveCourse = await course.save();
            res.redirect(`/courses/${saveCourse.slug}`);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CourseController();
