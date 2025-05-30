﻿#language: ru

@tree

Функционал: Управление формой

Как Аналитик я хочу
Добавлять управлять формой
чтобы видеть макет формы

Контекст:
	Дано я запускаю обработку

Сценарий: Устанавливать заголовок формы открываемой в окне разработки
	Когда в поле редактора я ввожу текст
"""
---Новый заголовок---
"""	
	И я формирую форму

	Тогда элемент формы с именем 'ЗаголовокФормы' стал равен "Новый заголовок"

Сценарий: Устанавливать заголовок формы открываемой в новом окне
	Когда в поле редактора я ввожу текст
"""
---Новый заголовок---
"""	
	И я нажимаю на кнопку "Сформировать в отдельном окне"

	Тогда открылось окно "Новый заголовок"

Сценарий: Форматировать заголовок формы
	Когда в поле редактора я ввожу текст
"""
---Новый заголовок---
"""	
	И я форматирую текст в редакторе

	Тогда текст в поле редактора стал равен
"""
--- Новый заголовок ---
"""