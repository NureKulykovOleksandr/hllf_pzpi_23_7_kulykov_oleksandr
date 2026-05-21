const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './university.sqlite',
    logging: false
});


const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING }
});

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    credits: { type: DataTypes.INTEGER }
});

const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true }
});

const Lesson = sequelize.define('Lesson', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    topic: { type: DataTypes.STRING, allowNull: false },
    room: { type: DataTypes.STRING }
});

const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.INTEGER, allowNull: false }
});


Teacher.hasMany(Course, { foreignKey: 'teacherId', onDelete: 'SET NULL' });
Course.belongsTo(Teacher, { foreignKey: 'teacherId' });

Course.hasMany(Lesson, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

Student.belongsToMany(Course, { through: 'StudentCourses' });
Course.belongsToMany(Student, { through: 'StudentCourses' });

Student.hasMany(Grade, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(Grade, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Grade.belongsTo(Course, { foreignKey: 'courseId' });


app.get('/api/students', async (req, res) => {
    const students = await Student.findAll({ include: Course });
    res.json(students);
});

app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/courses', async (req, res) => {
    const courses = await Course.findAll({ include: [Teacher, Lesson] });
    res.json(courses);
});

app.post('/api/courses', async (req, res) => {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
});

app.get('/api/grades', async (req, res) => {
    const grades = await Grade.findAll({ include: [Student, Course] });
    res.json(grades);
});

app.post('/api/grades', async (req, res) => {
    const newGrade = await Grade.create(req.body);
    res.status(201).json(newGrade);
});


sequelize.sync({ force: true }).then(async () => {
    console.log("База даних успішно синхронізована!");

    const teacher = await Teacher.create({ name: "Професор Коваленко", department: "Кафедра КН" });
    const course = await Course.create({ title: "Мобільна розробка", credits: 5, teacherId: teacher.id });
    const student = await Student.create({ name: "Белєбоба Белєбобовіч", email: "beleboba@gmail.com" });
    
    await Lesson.create({ topic: "Вступ до Android Studio та Kotlin", room: "Аудиторія 404", courseId: course.id });
    await Grade.create({ value: 95, studentId: student.id, courseId: course.id });
    
    await student.addCourse(course);

    console.log("Тестові дані успішно додано в базу!");
});

app.listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
});