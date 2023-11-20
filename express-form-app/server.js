const express = require('express')
const app = express()
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')

app.set('view engine', 'ejs')
app.set('views', './templates')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    let obj = {
        name: 'Alex', id: 2,
        title: 'Главная',
        hobby: ['Football', 'Skate', 'Paint']
    }

    res.render('index', obj)
})

app.get('/user', (req, res) => {
    res.render('user', { error: req.session.error ? req.session.error : '', errorAuth: req.session.errorAuth ? req.session.errorAuth : '', user: req.session.user ? JSON.parse(req.session.user) : '', title: 'Форма регистрации' })
})

// Были добавлены изменения к отслеживанию кабинета пользователя
app.get('/dash', (req, res) => {
    // Мы проверяем есть ли сессия с пользователем
    // Если она есть, тогда показываем кабинет пользователя
    if (req.session.user)
        // В шаблон дополнительно передаем данные относительно возможных ошибок в форме
        res.render('dash', { error: req.session.error ? req.session.error : '', user: req.session.user ? JSON.parse(req.session.user) : '', title: 'Кабинет пользователя' })
    else // Если сессии нет, то выполняем редирект на страницу регистрации
        res.redirect('/user')
})

// Этот метод отслеживает страницу выхода
app.get('/logout', (req, res) => {
    req.session.destroy() // При переходе на неё мы удаляем все сессии в проекте
    // И покаываем верный шаблон (файл logout.ejs был дополнительно создан)
    res.render('logout', { title: 'Выход из кабинета пользователя' })
})

// Этот метод отслеживает данные, поступившие из формы на странице с кабинетом
app.post('/user-update', (req, res) => {
    // Получаем все данные из самой формы
    // Мы только не получаем пароль (pass)
    let login = req.body.login
    let name = req.body.name
    let email = req.body.email

    // Создаем объект пользователя
    let userObj = {
        login: login,
        name: name,
        email: email,
        // Поскольку пароль не передается из формы, то мы его
        // устанавливаем вручную. Обращаемся к сессии, преобразовываем в JSON
        // и получаем доступ к свойству pass
        pass: JSON.parse(req.session.user).pass
    }

    // Проверяем все ошибки
    // Здесь такой же код как в уроках
    req.session.error = ""
    if (login.length < 5)
        req.session.error = "Длина логина маленькая"
    else if (name.length < 2)
        req.session.error = 'Длина имени маленькая'
    else if (!email.includes("@"))
        req.session.error = 'Email некорректный'

    // Сохраняем пользователя с новыми данными 
    // Сохранение только если нет ошибок
    if (req.session.error == "")
        req.session.user = JSON.stringify(userObj)

    // Переадресация на страницу с кабинетом пользователя
    res.redirect('/dash')
})


//Далее никаких изменений
app.post('/check-user-reg', (req, res) => {
    let login = req.body.login
    let name = req.body.name
    let email = req.body.email
    let pass = req.body.password

    let userObj = {
        login: login,
        name: name,
        email: email,
        pass: pass
    }

    req.session.error = ""
    if (login.length < 5)
        req.session.error = "Длина логина маленькая"
    else if (name.length < 2)
        req.session.error = 'Длина имени маленькая'
    else if (!email.includes("@"))
        req.session.error = 'Email некорректный'
    else if (pass.length < 3)
        req.session.error = 'Пароль неверный'
    else
        req.session.regUser = userObj

    req.session.user = JSON.stringify(userObj)
    res.redirect('/user')
})

app.post('/check-user-auth', (req, res) => {
    let login = req.body.login
    let pass = req.body.password

    req.session.errorAuth = ""
    if (login.length < 5)
        req.session.errorAuth = "Длина логина маленькая"
    else if (pass.length < 3)
        req.session.errorAuth = 'Пароль неверный'
    else {
        let userObj = JSON.parse(req.session.user)
        if (userObj.login == login && userObj.pass == pass)
            res.redirect('/dash')
        else
            req.session.errorAuth = 'Данные не совпадают'
    }

    res.redirect('/user')
})

let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`)
})
