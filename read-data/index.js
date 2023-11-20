const fs = require('fs') // Модуль для работы с файлами
const http = require('http') // Модуль для сервера

// Этот модуль нужен для файла с настройками .env
// Строка работает, так как был установлен модуль dotenv
// Настройки лучше хранить отдельно, поэтому мы так и делаем
require('dotenv').config()

// Создаем сервер
http.createServer((request, response) => {
    // Отправляем заголовки
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

    // При переходе на главную страницу у нас ничего особенного нет
    // Мы лишь отслеживаем переход и отображаем шаблон index.html
    if (request.url == '/')
        fs.createReadStream('templates/index.html').pipe(response)

    // Отслеживаем URL адрес /read-file
    else if (request.url == '/read-file') {
        // Здесь сперва проверяем есть ли нужный нам файл
        if (fs.existsSync('info/temp-file.txt')) { // Если файл есть
            // Если он есть, то мы считываем даные и помещаем в переменную
            // Важно считывать синхроннно, иначе если асинхронно, то сперва будет вывод информации и позже окончание считывания
            // Мы считываем данные, помещаем в переменную и выводим на экран
            let data = fs.readFileSync('info/temp-file.txt', { encoding: 'utf-8' })
            response.write('Данные прочитаны: ' + data)
        }
        response.end()
    }
    // Отслеживаем URL адрес /read-file
    else if (request.url == '/write-file') {
        // Проверяем есть ли папка
        if (!fs.existsSync('info')) {
            // Если папки нет, то создаем её
            fs.mkdir('info', (err) => {
                if (err) throw err
                // После создания синхронно записываем данные в файл
                fs.writeFileSync('info/temp-file.txt', 'Какой чудесный день!')
            })
            // Выводим обычное сообщение с текстом
            response.write('Данные записаны')
        } else
            // Если папка уже есть, то просто выводим текст об этом
            response.write('Папка уже существует, поэтому данные не были записаны')

        response.end()
    }


    // Для обращения к даным из файла .env прописываем: process.env.НАЗВАНИЕ
    // Я обращаюсь к порту и хосту
}).listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Сервер запущен по адресу: http://${process.env.HOST}:${process.env.PORT}`)
})