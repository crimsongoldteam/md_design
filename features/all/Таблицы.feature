﻿#language: ru

@tree

Функционал: Добавление таблицы и дерева

Как Аналитик я хочу
Добавлять таблицу
чтобы видеть макет формы

Контекст:
	Дано я запускаю обработку

Сценарий: Создавать таблицу по сокращенному описанию
	Когда в поле редактора я ввожу текст
"""	
Колонка 1 | Колонка 2
--- | ---
Значение 1 | Значение 2
"""	
	И я формирую форму

	Если в таблице "__Таблица" есть колонка "Колонка 1" Тогда
	Иначе
		И я вызываю исключение с текстом сообщения "Нет колонки"
	
	Тогда я сверяю сформированный код с файлом "Создавать таблицу"

Сценарий: Создавать таблицу по полному описанию
	Когда в поле редактора я ввожу текст
"""	
|Колонка 1 | Колонка 2|
|--- | --- |
|Значение 1 | Значение 2|
"""		
	И я формирую форму

	Если в таблице "__Таблица" есть колонка "Колонка 1" Тогда
	Иначе
		И я вызываю исключение с текстом сообщения "Нет колонки"

Сценарий: Создавать таблицу с одной колонкой #54
	Когда в поле редактора я ввожу текст
"""	
| Список     |
| ---------- |
| Значение 1 |
| Значение 2 |
"""		
	И я формирую форму

	Если в таблице "__Таблица" есть колонка "Список" Тогда
	Иначе
		И я вызываю исключение с текстом сообщения "Нет колонки"

 	Тогда я сверяю сформированный код с файлом "Создавать таблицу с одной колонкой"

Сценарий: Форматировать таблицу
	Когда в поле редактора я ввожу текст
"""	
|Колонка 1|Колонка 2|
|---|---|
|Значение 1|Значение 2|
"""		
	И я форматирую текст в редакторе

	Тогда текст в поле редактора стал равен
"""
 | Колонка 1  | Колонка 2  |
 | ---------- | ---------- |
 | Значение 1 | Значение 2 |
"""

Сценарий: Создавать таблицу многоуровневыми строками
	Когда в поле редактора я ввожу текст
"""	
| Колонка 1                      || Колонка 2  |
| Подколонка 1.1 | Подколонка 1.2 |            |
| -------------- | -------------- | ---------- |
| Значение 1                     || Значение 3 |
| Значение 1.1   | Значение 1.2   |            |
| Значение 2                     || Значение 4 |
| Значение 2.1   | Значение 2.2   |            |
"""		
	И я формирую форму	
	Тогда таблица '__Таблица' стала равной:
	| "Колонка 1"  | "Подколонка 1.2" | "Подколонка 1.1" | "Колонка 2"  |
	| "Значение 1" | "Значение 1.2"   | "Значение 1.1"   | "Значение 3" |
	| "Значение 2" | "Значение 2.2"   | "Значение 2.1"   | "Значение 4" |

	Тогда я сверяю сформированный код с файлом "Создавать таблицу многоуровневыми строками"
	
Сценарий: Форматировать таблицу с многоуровневыми строками
	Когда в поле редактора я ввожу текст
"""	
Колонка1||Колонка2
Подколонка1.1|Подколонка1.2|
---|---
Значение1||Значение3
Значение1.1|Значение1.2|
Значение2||Значение4
Значение2.1|Значение2.2|
"""		
	И я форматирую текст в редакторе
	Тогда текст в поле редактора стал равен
"""
| Колонка1                     || Колонка2  |
| Подколонка1.1 | Подколонка1.2 |           |
| ------------- | ------------- | --------- |
| Значение1                    || Значение3 |
| Значение1.1   | Значение1.2   |           |
| Значение2                    || Значение4 |
| Значение2.1   | Значение2.2   |           |
"""
	
Сценарий: Создавать таблицу с группой колонок
	Когда в поле редактора я ввожу текст
"""	
| -Группа 1-                      ||
| Подколонка 1.1 | Подколонка 1.2  |
| -------------- | --------------  |
| Значение 1.1   | Значение 1.2    |
| Значение 2.1   | Значение 2.2    |
"""		
	И я формирую форму	
	Тогда таблица '__Таблица' стала равной:
	| "Подколонка 1.1" | "Подколонка 1.2" |
	| "Значение 1.1"   | "Значение 1.2"   |
	| "Значение 2.1"   | "Значение 2.2"   |
	
	Тогда я сверяю сформированный код с файлом "Создавать таблицу с группой колонок"
	
Сценарий: Форматировать таблицу с группой колонок
	Когда в поле редактора я ввожу текст
"""	
|-Группа 1-||
|Подколонка 1.1|Подколонка 1.2|
|---|---|
|Значение 1.1|Значение 1.2|
|Значение 2.1|Значение 2.2|
"""		
	И я форматирую текст в редакторе
	Тогда текст в поле редактора стал равен
"""
| - Группа 1 -                   ||
| Подколонка 1.1 | Подколонка 1.2 |
| -------------- | -------------- |
| Значение 1.1   | Значение 1.2   |
| Значение 2.1   | Значение 2.2   |
"""
	
Сценарий: Создавать две таблицы #23
	Когда в поле редактора я ввожу текст
"""	
| Колонка 1  | Колонка 2  |
| ---------- | ---------- |
| Значение 1 | Значение 2 |

| Колонка 3  | Колонка 4  |
| ---------- | ---------- |
| Значение 3 | Значение 4 |
"""		
	И я формирую форму	
	
	Тогда таблица '__Таблица' стала равной:
		| "Колонка 1"  | "Колонка 2"  |
		| "Значение 1" | "Значение 2" |
	
	И таблица '__Таблица1' стала равной:
		| "Колонка 3"  | "Колонка 4"  |
		| "Значение 3" | "Значение 4" |

	
Сценарий: Редактировать таблицу #12
 	Когда в поле редактора я ввожу текст " "
	 
	Когда я нажимаю на кнопку с именем 'РедакторТаблицы'
	
	И открылось окно "Редактирование колонок таблицы"
	И в таблице 'ТаблицаКолонки' я нажимаю на кнопку "Добавить колонку"
	И в таблице 'ТаблицаКолонки' в поле "Заголовок" я ввожу текст "Колонка 1"
	И в таблице 'ТаблицаКолонки' я завершаю редактирование строки
	И в таблице 'ТаблицаКолонки' я нажимаю на кнопку "Добавить колонку"
	И в таблице 'ТаблицаКолонки' в поле "Заголовок" я ввожу текст "Колонка 2"
	И в таблице 'ТаблицаКолонки' я завершаю редактирование строки
	И я нажимаю на кнопку с именем 'ОК'

	Тогда текст в поле редактора стал равен
"""
| Колонка 1 | Колонка 2 |
| --------- | --------- |
"""
	
Сценарий: Для ячеек пустой таблицы тип колонок должнен быть строкой
	Когда в поле редактора я ввожу текст
"""	
| Колонка 1 |
| --------- |
"""		
	И я формирую форму

	И я выбираю пункт контекстного меню с именем '__ТаблицаКонтекстноеМенюДобавить' на элементе формы с именем '__Таблица'
	И в таблице '__Таблица' в поле с именем '__ТаблицаКолонка1' я ввожу текст "123"
	И в таблице '__Таблица' я завершаю редактирование строки

Сценарий: Создавать таблицу с колонкой без заголовка
	Когда в поле редактора я ввожу текст
"""	
|           |
| --------- |
"""		
	
	Тогда я сверяю сформированный код с файлом "Создавать таблицу с колонкой без заголовка"

Сценарий: Создавать таблицу со снятым флажком
	*Когда ввожу текст в редакторе
		Когда в поле редактора я ввожу текст
		"""	
		|Колонка 1|
		| ---|
		|[]Значение 1|
		"""	
	*Когда форматирую текст
		Когда я форматирую текст в редакторе
		Тогда текст в поле редактора стал равен
		"""	
		| Колонка 1      |
		| -------------- |
		| [ ] Значение 1 |
		"""	
	*Когда генерирую код
		Тогда я сверяю сформированный код с файлом "Создавать таблицу с флажком"


Сценарий: Создавать таблицу с установленным флажком
	*Когда ввожу текст в редакторе
		Когда в поле редактора я ввожу текст
		"""	
		|Колонка 1|
		| ---|
		|[х]Значение 1|
		"""	
	*Когда форматирую текст
		Когда я форматирую текст в редакторе
		Тогда текст в поле редактора стал равен
		"""	
		| Колонка 1      |
		| -------------- |
		| [X] Значение 1 |
		"""			


// Сценарий: Создавать таблицу с двумя пустыми колнками
// 	*Когда ввожу текст в редакторе
// 		Когда в поле редактора я ввожу текст
// 		"""	
// 		|     |     |
// 		| --- | --- |
// 		"""	

// 	*Когда генерирую код
// 		Тогда я сверяю сформированный код с файлом "Создавать таблицу с двумя пустыми колнками"
