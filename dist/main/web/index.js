/**
 * Файл для скриптов приложения
 */

// класс взаимодействия с БД
class DB {
  // в конструкторе класса сохраняются заготовленные запросы в базу
  constructor() {
    // запрос создания таблицы врачей
    this.CREATE_DOCTOR = `
      CREATE TABLE doctors (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      timefromfree TEXT NULL,
      timetofree TEXT NULL,
      timefrompaid TEXT NULL,
      timetopaid TEXT NULL,
      queue TEXT NULL)`;
    // запрос создания таблицы пользователей
    this.CREATE_PACIENT = `
      CREATE TABLE pacient (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      adress TEXT NULL)`;
    // создание таблицы приемов
    this.CREATE_PRIEM = `
      CREATE TABLE priemy (
      id INTEGER PRIMARY KEY,
      pacient TEXT NOT NULL,
      doctor TEXT NULL,
      paid INTEGER NOT NULL,
      time TEXT NULL)
    `;

    // получение данных из таблицы врачей
    this.GET_DOCTOR = `SELECT * FROM doctors`;
    // получение данных из таблицы пациентов
    this.GET_PACIENT = `SELECT * FROM pacient`;
    // получение данных из таблицы приемов
    this.GET_PRIEM = `SELECT * FROM priemy`;
  }

  // метод создания таблицы врачей
  async create_doctors() { await eel.requests(this.CREATE_DOCTOR)(); }
  // метод создания таблицы пациентов
  async create_pacient() { await eel.requests(this.CREATE_PACIENT)(); }
  // создание таблицы приема
  async create_priem() { await eel.requests(this.CREATE_PRIEM)(); }
  // получение таблицы врачей
  async get_doctors() { return await eel.get_requests(this.GET_DOCTOR)(); }
  // получение таблицы пациентов
  async get_pacient() { return await eel.get_requests(this.GET_PACIENT)(); }
  // получение таблицы приемов
  async get_priem() { return await eel.get_requests(this.GET_PRIEM)(); }
  // метод выполнения запросов
  async set_data(req) { await eel.requests(req)() }
}

// создание экземпляра взаимодействия с БД
const db = new DB();

// выполнение запросов на создание таблиц
db.create_doctors();
db.create_pacient();
db.create_priem();
// выполнение запросов на получение данных врачей и пациентов из таблиц
var doctors = db.get_doctors();
var pacient = db.get_pacient();
var priem = db.get_priem();

// функция расписания
function get_timetable() {
  // цикл вывода расписания врачей
  doctors.then(res => {
    // создание переменной для сохранения блока расписания врача
    // на текущей итерации цикла
    var block = '';

    // цикл формирования строки таблицы
    res.forEach(doc => {
      // создание открывающего тега строки таблицы и добавление его в строку
      block += `<tr onclick="add">`
        // создание ячейки таблицы с номером расписания
        block += `<td> ${doc[0]} </td>`
        // создание ячейки Врач с именем врача и направлением в котором он работает
        block += `<td> ${doc[1]} (${doc[6]}) </td>`
        // создание ячейки Бесплатный с расписанием работы
        block += `<td> ${doc[2]} - ${doc[3]} </td>`
        // создание ячейки Платный с расписанием работы
        block += `<td> ${doc[4]} - ${doc[5]} </td>`
        // создание ячейки Время приема с расписанием работы
        block += `<td> ${doc[2]} - ${doc[5]} </td>`
      // создание закрывающего тега строки таблицы и добавление его в строку
      block += `</tr>`
    });
  
    // получение блока расписания
    var queue = document.getElementById('queue');
    // добавление блока в виде HTML в блок расписания
    queue.innerHTML = block
  });
}

// функция формирования таблицы записи на бесплатный прием
function get_free() {
  doctors.then(res => {
    var block = '';
  
    res.forEach(doc => {
      block += `<tr onclick="add">`
        block += `<td> ${doc[0]} </td>`
        block += `<td> ${doc[1]} (${doc[6]}) </td>`
        block += `<td> ${doc[2]} - ${doc[3]} </td>`
        block += `
        <td>
          <label>Время:</label>
          <input id="doctor${doc[0]}1" type="number" min="${doc[2].split(':')[0]}" max="${doc[3].split(':')[0]}" value="${doc[2].split(':')[0]}" />
          <span>:</span>
          <input id="doctor${doc[0]}2" type="number" min="0" max="59" value="${doc[3].split(':')[1]}" />
          <button onclick="set_free(${doc[0]}, '${doc[1]} (${doc[6]})')">Записаться</button>
        </td>`
      block += `</tr>`
    });
  
    var queue = document.getElementById('queue');
    queue.innerHTML = block
  });
}

// формирование таблицы вызова врача на дом
function get_call() {
  doctors.then(res => {
    var block = '';
  
    res.forEach(doc => {
      block += `<tr onclick="add">`
        block += `<td> ${doc[0]} </td>`
        block += `<td> ${doc[1]} (${doc[6]}) </td>`
        block += `<td> ${doc[2]} - ${doc[3]} </td>`
        block += `
        <td>
          <label>Время:</label>
          <input id="doctor${doc[0]}1" type="number" min="08" max="16" value="08" />
          <span>:</span>
          <input id="doctor${doc[0]}2" type="number" min="0" max="59" value="${doc[3].split(':')[1]}" />
          <button onclick="set_free(${doc[0]}, '${doc[1]} (${doc[6]})')">Вызвать</button>
        </td>`
      block += `</tr>`
    });
  
    var queue = document.getElementById('queue');
    queue.innerHTML = block
  });
}

// формирования таблицы записи на платный прием
function get_paid() {
  doctors.then(res => {
    var block = '';
  
    res.forEach(doc => {
      block += `<tr onclick="add">`
        block += `<td> ${doc[0]} </td>`
        block += `<td> ${doc[1]} (${doc[6]}) </td>`
        block += `<td> ${doc[4]} - ${doc[5]} </td>`
        block += `
        <td>
          <label>Время:</label>
          <input id="doctor${doc[0]}1" type="number" min="${doc[4].split(':')[0]}" max="${doc[5].split(':')[0]}" value="${doc[4].split(':')[0]}" />
          <span>:</span>
          <input id="doctor${doc[0]}2" type="number" min="0" max="59" value="${doc[5].split(':')[1]}" />
          <button onclick="set_paid(${doc[0]}, '${doc[1]} (${doc[6]})')">Записаться</button>
        </td>`
      block += `</tr>`
    });
  
    var queue = document.getElementById('queue');
    queue.innerHTML = block
  });
}

// формирование строки пациента
function get_pacient() {
  var block = document.getElementById('pacient');
  pacient.then(res => block.innerHTML = `<p style="width:100%;text-align:right;margin:10px;"><b>${res[0][1]}</b>(${res[0][2]})</p>`);

  return pacient;
}

function set_free(id, doctor) {
  var time1 = document.getElementById(`doctor${id}1`).value; // переменная часа записи
  var time2 = document.getElementById(`doctor${id}2`).value; // переменная минут записи
  var gpacient = get_pacient(); // получение данных пациента
  var pac = false; // переменная результата проверки совпадения времени

  // получение всех приемов из базы
  priem.then(pr => {
    // цикл по приемам
    pr.forEach(el => {
      // проверка совпадения врача
      if (el[2] == doctor) {
        // проверка совпадения времени
        if (el[4] == `${time1}:${time2}`) {
          alert("Данное время занято!"); // если все проверки пройдены пользователю вернется сообщение о том, что время занятов

          pac = true; // и результат проверки переключается на true
        }
      }
    });
  });

  setTimeout(function() {
    if (pac) return;
    // если результат проверки в режиме false, то запись будет выполнена
    if (!pac) {
      // получение пациентов
      gpacient.then(res => {
        // формирование запроса на запись в базу
        var req = `INSERT INTO priemy (pacient, doctor, paid, time) VALUES ('${res[0][1]}', '${doctor}', '0', '${time1}:${time2}')`;

        // выполнение записи в базу
        db.set_data(req);
        // получение обновленных приемов из базы
        priem = db.get_priem();
      });
    }
  }, 300)

  pac = false; // после того как функция выполнится результат проверки сбрасывается в false
}
function set_paid(id, doctor) {
  var time1 = document.getElementById(`doctor${id}1`).value; // переменная часа записи
  var time2 = document.getElementById(`doctor${id}2`).value; // переменная минут записи
  var gpacient = get_pacient(); // получение данных пациента
  var pac = false; // переменная результата проверки совпадения времени

  // получение всех приемов из базы
  priem.then(pr => {
    // цикл по приемам
    pr.forEach(el => {
      // проверка совпадения врача
      if (el[2] == doctor) {
        // проверка совпадения времени
        if (el[4] == `${time1}:${time2}`) {
          alert("Данное время занято!"); // если все проверки пройдены пользователю вернется сообщение о том, что время занятов

          pac = true; // и результат проверки переключается на true
        }
      }
    });
  });
  
  setTimeout(function() {
    if (pac) return;
    // если результат проверки в режиме false, то запись будет выполнена
    if (!pac) {
      // получение пациентов
      gpacient.then(res => {
        // формирование запроса на запись в базу
        var req = `INSERT INTO priemy (pacient, doctor, paid, time) VALUES ('${res[0][1]}', '${doctor}', '1', '${time1}:${time2}')`;

        // выполнение записи в базу
        db.set_data(req);
        // получение обновленных приемов из базы
        priem = db.get_priem();
      });
    }
  }, 300)

  pac = false; // после того как функция выполнится результат проверки сбрасывается в false
}
// запись данных в таблицу пациентов
function set_pacient() {
  var pac = 0; // 
  pacient.then(res => pac = res);
  console.log(pac);
  if (pac) return;
  var username = document.getElementById('username').value;
  var adress = document.getElementById('adress').value;
  var req = `INSERT INTO pacient (name, adress) VALUES ('${username}', '${adress}')`;

  db.set_data(req);
}