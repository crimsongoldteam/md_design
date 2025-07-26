// MIT License

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
Процедура ПриОткрытии(Отказ)
	ЗаполнитьКартинки();
КонецПроцедуры

#КонецОбласти

#Область ОбработчикиСобытийЭлементовТаблицыФормыСписок

&НаКлиенте
Процедура СписокКартинокВыбор(Элемент, ВыбраннаяСтрока, Поле, СтандартнаяОбработка)
	СтандартнаяОбработка = Ложь;
	
	ТекущаяСтрока = СписокКартинок.НайтиПоИдентификатору(ВыбраннаяСтрока);
	Закрыть(ТекущаяСтрока.Значение);
КонецПроцедуры

#КонецОбласти     
 
#Область СлужебныеПроцедурыИФункции

&НаКлиенте
Процедура ЗаполнитьКартинки()
	СтандартныеКартинки = УправлениеСвойствами().ПолучитьСтандартныеКартинки();
	ЗаполнитьКартинкиНаСервере(СтандартныеКартинки);
КонецПроцедуры

&НаСервере
Процедура ЗаполнитьКартинкиНаСервере(СтандартныеКартинки)
	Для Каждого КлючЗначение Из СтандартныеКартинки Цикл
		СписокКартинок.Добавить(КлючЗначение.Ключ);
	КонецЦикла;

	Для Каждого МетаКартинка Из Метаданные.ОбщиеКартинки Цикл
		СписокКартинок.Добавить(МетаКартинка.Имя);
	КонецЦикла;
	
	СписокКартинок.СортироватьПоЗначению();
	
	МассивОтсутствующих = Новый Массив;
	Для Каждого ЭлементСписка Из СписокКартинок Цикл
		Попытка
			ЭлементСписка.Картинка = БиблиотекаКартинок[ЭлементСписка.Значение];
		Исключение
			МассивОтсутствующих.Добавить(ЭлементСписка);
		КонецПопытки;
	КонецЦикла;
	
	Для Каждого ОтсутствующийЭлемент Из МассивОтсутствующих Цикл
		СписокКартинок.Удалить(ОтсутствующийЭлемент);
	КонецЦикла;	
КонецПроцедуры

#Область Модули

&НаКлиенте
Функция УправлениеСвойствами()
	Возврат ВладелецФормы.УправлениеСвойствами();
КонецФункции

#КонецОбласти

#КонецОбласти     
