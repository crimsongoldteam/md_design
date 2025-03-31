﻿// MIT License

// Copyright (c) 2025 Zherebtsov Nikita <nikita@crimsongold.ru>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// https://github.com/crimsongoldteam/md_design

#Область ОбработчикиСобытийФормы

&НаКлиенте
Процедура Построить(ДанныеГенератора) Экспорт
	ПостроитьНаСервере(ДанныеГенератора);
	
	ЗаголовокФормы = ДанныеГенератора.ЗаголовокФормы;
	Если ПустаяСтрока(ЗаголовокФормы) Тогда
		ЗаголовокФормы = "Накидка. Прототип формы";
	КонецЕсли;
	
	Заголовок = ЗаголовокФормы;
КонецПроцедуры

#КонецОбласти

#Область ОбработчикиКомандФормы

&НаКлиенте
Процедура __КомандаЗаглушка(Команда)
	Сообщение = Новый СообщениеПользователю;
	Сообщение.Текст = "Заглушка";
	Сообщение.Сообщить();
КонецПроцедуры

#КонецОбласти

#Область СлужебныеПроцедурыИФункции

&НаСервере
Процедура ПостроитьНаСервере(ДанныеГенератора) Экспорт
	ОбработкаОбъект = РеквизитФормыВЗначение("Объект");
	ОбработкаОбъект.ПостроитьНаСервере(
		ЭтотОбъект, 
		Элементы.__ГруппаПросмотр, 
		ДанныеГенератора);
КонецПроцедуры

#КонецОбласти